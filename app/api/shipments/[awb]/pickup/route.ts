import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getDelhiveryConfig, delhiveryRequest } from '@/lib/delhivery'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, context: { params: Promise<{ awb: string }> }) {
  const { awb: awbRaw } = await context.params
  const awb = decodeURIComponent(awbRaw)
  try {
    const form = await req.formData()
    const pickup_date = String(form.get('pickup_date') || '')
    const pickup_slot = String(form.get('pickup_slot') || '')
    if (!awb || !pickup_date || !pickup_slot) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }

    const admin = createAdminClient()
    // Fetch pickup location name from shipment or env
    const { data: shipmentRow } = await admin
      .from('shipments')
      .select('pickup_name')
      .eq('awb', awb)
      .maybeSingle()
    const pickup_location = (shipmentRow?.pickup_name
      || process.env.DELHIVERY_DEFAULT_PICKUP_NAME
      || 'sai') as string

    // Map slot to a pickup_time (hh:mm:ss)
    const slotToTime: Record<string, string> = {
      mid_day: '11:00:00',
      evening: '15:00:00',
      late_evening: '19:00:00',
    }
    const pickup_time = slotToTime[pickup_slot] || '11:00:00'

    // Call Delhivery Pickup Request API
    const cfg = getDelhiveryConfig()
    const bodyA = {
      pickup_time,
      pickup_date, // YYYY-MM-DD
      pickup_location, // registered Client Warehouse name
      expected_package_count: 1,
    }
    let provider = await delhiveryRequest<any>(cfg, '/fm/request/new/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyA),
    })
    // Some accounts expect keys: warehouse_name, quantity
    const okA = provider.status >= 200 && provider.status < 300
    const looksAcceptedA = okA && /success|scheduled|accepted/i.test(JSON.stringify(provider.data || {}))
    if (!looksAcceptedA) {
      const bodyB = {
        pickup_time,
        pickup_date,
        warehouse_name: pickup_location,
        quantity: 1,
      }
      try {
        provider = await delhiveryRequest<any>(cfg, '/fm/request/new/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyB),
        })
      } catch (_) {}
    }

    // Validate provider acknowledgement
    const accepted = (() => {
      if (provider.status >= 200 && provider.status < 300) {
        const d: any = provider?.data || {}
        if (d?.success === true) return true
        const txt = (JSON.stringify(d) || '').toLowerCase()
        return /success|scheduled|accepted/.test(txt)
      }
      return false
    })()

    if (!accepted) {
      const url = new URL('/seller/orders', req.url)
      url.searchParams.set('pickup', 'failed')
      // Friendlier error mapping for common Delhivery wallet errors
      try {
        const d: any = provider?.data || {}
        const full = JSON.stringify(d).toLowerCase()
        const prepaidMsg: string | undefined = (d && (d.prepaid || d.message || d.error)) as any
        const txt = String(prepaidMsg || full)
        const m = txt.match(/balance\s+is\s+(-?\d+(?:\.\d+)?)\s+which\s+is\s+less\s+than\s+(\d+(?:\.\d+)?)/i)
        if (m) {
          url.searchParams.set('reason', 'wallet_low')
          url.searchParams.set('wallet_balance', m[1])
          url.searchParams.set('wallet_min', m[2])
        } else {
          const snippet = (() => { try { return JSON.stringify(provider?.data).slice(0, 160) } catch { return '' } })()
          if (snippet) url.searchParams.set('reason', snippet)
        }
      } catch (_) {
        // fallback to raw snippet on any parsing error
        const snippet = (() => { try { return JSON.stringify(provider?.data).slice(0, 160) } catch { return '' } })()
        if (snippet) url.searchParams.set('reason', snippet)
      }
      return NextResponse.redirect(url.toString(), 303)
    }

    // Persist pickup info regardless; include a shallow response snapshot if available
    let { error } = await admin
      .from('shipments')
      .update({
        pickup_requested_at: new Date().toISOString(),
        pickup_date,
        pickup_slot,
        // optional provider snapshot for debugging/traceability
        pickup_meta: provider?.data || null,
        pickup_id: (provider as any)?.data?.pickup_id || (provider as any)?.data?.id || null,
        pickup_status: (provider as any)?.data?.status || null,
        status: 'pickup_scheduled',
      } as any)
      .eq('awb', awb)
    if (error && /column\s+pickup_meta/i.test(error.message || '')) {
      // Retry without pickup_meta if column doesn't exist
      const retry = await admin
        .from('shipments')
        .update({
          pickup_requested_at: new Date().toISOString(),
          pickup_date,
          pickup_slot,
          status: 'pickup_scheduled',
        } as any)
        .eq('awb', awb)
      error = retry.error || null
    }
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    // Redirect back to orders with a success hint
    const url = new URL('/seller/orders', req.url)
    url.searchParams.set('pickup', 'scheduled')
    return NextResponse.redirect(url.toString(), 303)
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'pickup_failed' }, { status: 500 })
  }
}


