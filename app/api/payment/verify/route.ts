import { NextRequest, NextResponse } from 'next/server'
import { getDelhiveryConfig, createShipment, getPackingSlip } from '@/lib/delhivery'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Proxy to Supabase Edge Function `payments-verify` (server-side only)
export async function POST(request: NextRequest) {
  const secret = process.env.EDGE_FUNCTIONS_SHARED_SECRET
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const body = await request.json()

  // COD short-circuit: do NOT call Razorpay verify; create shipment directly
  if (body?.cod === true) {
    try {
      const orderId = String(body?.orderId || '')
      if (!orderId) return NextResponse.json({ success: false, error: 'orderId required for COD' }, { status: 400 })

      const admin = createAdminClient()
      const { data: orderRow, error: orderErr } = await admin
        .from('orders')
        .select('id, amount, metadata, razorpay_order_id, status')
        .eq('id', orderId)
        .single()
      if (orderErr || !orderRow) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
      }

      const meta = (orderRow?.metadata as any) || {}
      // Resolve seller_id from metadata or fallback via product_id → products.seller_id
      let sellerId: string | null = (meta as any)?.seller_id ?? null
      if (!sellerId) {
        try {
          const productId = (meta as any)?.product_id as string | undefined
          if (productId) {
            const { data: prod, error: prodErr } = await admin
              .from('products')
              .select('seller_id')
              .eq('id', productId)
              .single()
            if (!prodErr) sellerId = (prod as any)?.seller_id ?? null
          }
        } catch {}
      }
      const shipRaw = (meta?.shipping as any) || {}
      // Derive name from multiple key shapes
      let derivedName = (() => {
        const rawName = (shipRaw?.name ?? '') as string
        if (rawName && rawName.trim().length > 0) return rawName.trim()
        const firstSnake = (shipRaw?.first_name ?? '') as string
        const lastSnake = (shipRaw?.last_name ?? '') as string
        const firstCamel = (shipRaw?.firstName ?? '') as string
        const lastCamel = (shipRaw?.lastName ?? '') as string
        const first = (firstSnake || firstCamel).trim()
        const last = (lastSnake || lastCamel).trim()
        const full = [first, last].filter(Boolean).join(' ')
        return full.trim()
      })()

      const ship = {
        name: derivedName,
        address: String(shipRaw?.address ?? ''),
        city: String(shipRaw?.city ?? ''),
        state: String(shipRaw?.state ?? ''),
        pincode: String(shipRaw?.pincode ?? ''),
        phone: String(shipRaw?.phone ?? ''),
        email: String(shipRaw?.email ?? ''),
      }
      // Validate minimal shipping
      const required = [ship.address, ship.city, ship.state, ship.pincode, ship.phone]
      if (required.some(v => !v || String(v).trim().length === 0)) {
        return NextResponse.json({ success: false, error: 'Missing shipping fields in order metadata' }, { status: 400 })
      }

      // Compute COD amount in rupees (orders.amount may be paise). Heuristic: if > 1000, treat as paise.
      const rawAmount = Number(orderRow?.amount || 0)
      const codAmount = rawAmount > 1000 ? Math.round(rawAmount / 100) : rawAmount

      const cfg = getDelhiveryConfig()
      const pickupName = process.env.DELHIVERY_DEFAULT_PICKUP_NAME || 'sai'
      const parcelMeta = (meta?.parcel as any) || {}
      const createInput = {
        orderId,
        paymentMode: 'COD' as const,
        codAmount,
        sellerPickupLocation: {
          name: pickupName,
          address: 'N/A',
          city: 'N/A',
          state: 'N/A',
          pincode: String(process.env.DELHIVERY_DEFAULT_PICKUP_PIN || ''),
          phone: String(process.env.DELHIVERY_DEFAULT_PICKUP_PHONE || '')
        },
        consignee: ship,
        parcel: {
          weightInGrams: Number(parcelMeta?.weight_g || 500),
          lengthCm: parcelMeta?.length_cm ? Number(parcelMeta.length_cm) : 20,
          breadthCm: parcelMeta?.breadth_cm ? Number(parcelMeta.breadth_cm) : 10,
          heightCm: parcelMeta?.height_cm ? Number(parcelMeta.height_cm) : 5,
          declaredValue: Number(parcelMeta?.declared_value ?? codAmount)
        },
        items: undefined
      }

      // Create COD shipment
      const created = await createShipment(cfg, createInput as any)
      const providerStatus = created?.status
      const providerData = created?.data as any
      const awb = providerData?.packages?.[0]?.waybill as string | undefined

      // Persist metadata snapshot; mark COD as placed (COD is not yet paid )
      try {
        const nextMeta = { ...meta, seller_id: sellerId ?? (meta as any)?.seller_id ?? null, shipping: ship, shipment: { provider: 'delhivery', waybill: awb || null, created_at: new Date().toISOString(), provider_status: providerStatus, provider_response: providerData } }
        await admin.from('orders').update({ metadata: nextMeta as any, status: 'cod_placed' }).eq('id', orderId)
      } catch (e) {
        console.error('cod.persist_awb_failed', (e as any)?.message || e)
      }

      if (!awb || !(String(providerStatus || '').startsWith('2'))) {
        return NextResponse.json({ success: false, error: 'Delhivery did not return AWB', provider: providerData }, { status: 502 })
      }

      // Insert shipments row
      try {
        const admin2 = createAdminClient()
        const ins = await admin2.from('shipments').insert({
          order_id: orderId,
          seller_id: sellerId,
          provider: 'delhivery',
          awb,
          status: 'created',
          payment_mode: 'COD',
          cod_amount: codAmount,
          label_url: null,
          pickup_name: pickupName,
          consignee: ship as any,
          parcel: createInput.parcel as any,
        } as any)
        if (ins.error) console.error('cod.shipment_insert_failed', ins.error)
      } catch (e) {
        console.error('cod.shipment_insert_exception', (e as any)?.message || e)
      }

      return NextResponse.json({ success: true, orderId, awb })
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || 'COD flow failed' }, { status: 500 })
    }
  }

  // Prepaid path (Razorpay)
  if (!secret || !supabaseUrl) {
    return NextResponse.json({ success: false, error: 'Server not configured to call edge function' }, { status: 500 })
  }

  const resp = await fetch(`${supabaseUrl}/functions/v1/payments-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Secret': secret,
    },
    body: JSON.stringify(body),
  })

  const text = await resp.text()
  const data = (() => { try { return JSON.parse(text) } catch { return { raw: text } } })()

  // Normalize response for the client button to simply check `success`
  if (resp.ok) {
    // Success: create shipment synchronously so it definitely happens
    try {
      const orderId = data?.orderId as string | undefined
      if (orderId) {
        const admin = createAdminClient()
        // Load order with shipping fields
        const { data: orderRow, error: orderErr } = await admin
          .from('orders')
          .select('id, amount, metadata, razorpay_order_id')
          .eq('id', orderId)
          .single()
        if (orderErr) {
          console.error('fulfillment.load_order_failed', orderErr)
          throw new Error('order_load_failed')
        }

        // Extract buyer shipping from orders.metadata
        const meta = (orderRow?.metadata as any) || {}
        // Resolve seller_id from metadata or fallback via product_id
        let sellerId: string | null = (meta as any)?.seller_id ?? null
        if (!sellerId) {
          try {
            const productId = (meta as any)?.product_id as string | undefined
            if (productId) {
              const { data: prod, error: prodErr } = await admin
                .from('products')
                .select('seller_id')
                .eq('id', productId)
                .single()
              if (!prodErr) sellerId = (prod as any)?.seller_id ?? null
            }
          } catch {}
        }
        const shipRaw = (meta?.shipping as any) || {}
        // Normalize/trim and set safe defaults
        let derivedName = (() => {
          const rawName = (shipRaw?.name ?? '') as string
          if (rawName && rawName.trim().length > 0) return rawName.trim()
          const firstSnake = (shipRaw?.first_name ?? '') as string
          const lastSnake = (shipRaw?.last_name ?? '') as string
          const firstCamel = (shipRaw?.firstName ?? '') as string
          const lastCamel = (shipRaw?.lastName ?? '') as string
          const first = (firstSnake || firstCamel).trim()
          const last = (lastSnake || lastCamel).trim()
          const full = [first, last].filter(Boolean).join(' ')
          return full.trim()
        })()

        // If still no name, try pulling from Razorpay order notes (we set notes=metadata on create)
        if (!derivedName && orderRow?.razorpay_order_id && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
          try {
            const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')
            const rp = await fetch(`https://api.razorpay.com/v1/orders/${orderRow.razorpay_order_id}`, {
              headers: { Authorization: `Basic ${auth}` },
            })
            if (rp.ok) {
              const rpJson: any = await rp.json()
              const notes = (rpJson?.notes as any) || {}
              const ns = (notes?.shipping as any) || notes
              const n1 = (ns?.name ?? '') as string
              const f1 = (ns?.first_name ?? ns?.firstName ?? '') as string
              const l1 = (ns?.last_name ?? ns?.lastName ?? '') as string
              const combined = (n1 && n1.trim()) || [f1, l1].filter((s: string) => s && s.trim().length > 0).join(' ').trim()
              if (combined) derivedName = combined
            }
          } catch (e) {
            console.error('fulfillment.fetch_rp_order_failed', (e as any)?.message || e)
          }
        }
        const ship = {
          name: derivedName,
          address: (shipRaw?.address ?? '') as string,
          city: (shipRaw?.city ?? '') as string,
          state: (shipRaw?.state ?? '') as string,
          pincode: (shipRaw?.pincode ?? '') as string,
          phone: (shipRaw?.phone ?? '') as string,
          email: (shipRaw?.email ?? '') as string,
        }
        // Trim whitespace
        for (const k of Object.keys(ship) as (keyof typeof ship)[]) {
          const v = ship[k]
          if (typeof v === 'string') (ship as any)[k] = v.trim()
        }
        const parcelMeta = (meta?.parcel as any) || {}

        const required = [ship.address, ship.city, ship.state, ship.pincode, ship.phone]
        if (required.some(v => !v || String(v).trim().length === 0)) {
          console.error('fulfillment.missing_shipping_in_metadata', { orderId, shipping: ship })
          throw new Error('missing_shipping')
        }

        // TODO: when multi-seller is ready, join order_items → seller_id → profiles
        const pickupName = process.env.DELHIVERY_DEFAULT_PICKUP_NAME || 'sai'
        const isCOD = false // per instruction: Prepaid only for automation
        const cfg = getDelhiveryConfig()

        const createInput = {
          orderId,
          paymentMode: isCOD ? 'COD' as const : 'Prepaid' as const,
          codAmount: undefined,
          sellerPickupLocation: {
            name: pickupName,
            address: 'N/A',
            city: 'N/A',
            state: 'N/A',
            pincode: String(process.env.DELHIVERY_DEFAULT_PICKUP_PIN || ''),
            phone: String(process.env.DELHIVERY_DEFAULT_PICKUP_PHONE || '')
          },
          consignee: {
            name: String(derivedName || ship.name || ''),
            address: String(ship.address),
            city: String(ship.city),
            state: String(ship.state),
            pincode: String(ship.pincode),
            phone: String(ship.phone),
            email: String(ship.email)
          },
          parcel: {
            weightInGrams: Number(parcelMeta?.weight_g || 500),
            lengthCm: parcelMeta?.length_cm ? Number(parcelMeta.length_cm) : 20,
            breadthCm: parcelMeta?.breadth_cm ? Number(parcelMeta.breadth_cm) : 10,
            heightCm: parcelMeta?.height_cm ? Number(parcelMeta.height_cm) : 5,
            declaredValue: Number(parcelMeta?.declared_value ?? orderRow?.amount ?? 0)
          },
          items: undefined
        }
        try {
          const created = await createShipment(cfg, createInput as any)
          const providerStatus = created?.status
          const providerData = created?.data as any
          const awb = providerData?.packages?.[0]?.waybill as string | undefined

          // Persist shipment record into metadata for tracking and diagnostics
          try {
            const nextMeta = {
              ...meta,
              seller_id: (typeof sellerId !== 'undefined' ? sellerId : (meta as any)?.seller_id) ?? null,
              shipping: ship,
              shipment: {
                provider: 'delhivery',
                waybill: awb || null,
                created_at: new Date().toISOString(),
                provider_status: providerStatus,
                provider_response: providerData,
              },
            }
            await admin.from('orders').update({ metadata: nextMeta as any }).eq('id', orderId)
          } catch (persistErr) {
            console.error('fulfillment.persist_awb_failed', persistErr)
          }

          // If provider did not return AWB or non-2xx, surface an error in logs
          if (!awb || !(String(providerStatus || '').startsWith('2'))) {
            console.error('fulfillment.no_awb_or_bad_status', { providerStatus, providerData })
            throw new Error('Delhivery did not return a waybill. Verify pickup_location, address, and pincode; ensure warehouse is approved.')
          }

          // Insert into shipments table (best-effort)
          try {
            const admin2 = createAdminClient()
            const ins = await admin2.from('shipments').insert({
              order_id: orderId,
              seller_id: sellerId,
              provider: 'delhivery',
              awb,
              status: 'created',
              payment_mode: 'Prepaid',
              cod_amount: null,
              label_url: null,
              pickup_name: pickupName,
              consignee: ship as any,
              parcel: createInput.parcel as any,
            } as any)
            if (ins.error) console.error('fulfillment.shipment_insert_failed', ins.error)
          } catch (e) {
            console.error('fulfillment.shipment_insert_exception', (e as any)?.message || e)
          }

          try {
            await getPackingSlip(cfg, [awb], '4R')
          } catch (psErr) {
            console.error('fulfillment.packing_slip_failed', psErr)
          }
        } catch (e) {
          console.error('fulfillment.create_shipment_failed', (e as any)?.message || e)
        }
      }
    } catch (e) {
      console.error('fulfillment.run_failed', (e as any)?.message || e)
    }

    // Return verification success to client immediately
    return NextResponse.json({ success: true, verification: data }, { status: 200 })
  }

  const message = (data?.error?.message
    || data?.message
    || (typeof data === 'string' ? data : null)
    || 'Verification failed') as string
  const code = (data?.error?.code || 'verification_failed') as string
  return NextResponse.json({ success: false, code, error: message }, { status: resp.status })
}