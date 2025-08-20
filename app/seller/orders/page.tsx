import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, FileDown, Printer } from "lucide-react"
import { CancelShipmentButton } from "@/components/seller/cancel-shipment-button"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Flash } from "@/components/ui/flash"

interface ShipmentRow {
  id: string
  order_id: string
  seller_id: string | null
  awb: string
  status: string
  payment_mode: string | null
  cod_amount: number | null
  label_url: string | null
  pickup_name: string | null
  consignee: { name?: string; phone?: string; email?: string; address?: string; city?: string; state?: string; pincode?: string } | null
  parcel: any
  created_at: string
}

function getStatusIcon(status: string) {
  const s = (status || '').toLowerCase()
  if (s.includes('delivered')) return <CheckCircle className="h-4 w-4" />
  if (s.includes('shipped')) return <Truck className="h-4 w-4" />
  if (s.includes('cancel')) return <XCircle className="h-4 w-4" />
  if (s.includes('process')) return <Package className="h-4 w-4" />
  return <Clock className="h-4 w-4" />
}

function getStatusColor(status: string) {
  const s = (status || '').toLowerCase()
  if (s.includes('delivered')) return "bg-green-100 text-green-700"
  if (s.includes('shipped')) return "bg-purple-100 text-purple-700"
  if (s.includes('cancel')) return "bg-red-100 text-red-700"
  if (s.includes('process')) return "bg-blue-100 text-blue-700"
  return "bg-amber-100 text-amber-700"
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth?.user?.id ?? null

  if (!uid) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Please sign in to view your orders.</p>
        <Link href="/login" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800">
          Go to Sign In →
        </Link>
      </div>
    )
  }

  const { data, error } = await supabase
    .from('shipments')
    .select('id, order_id, seller_id, awb, status, payment_mode, cod_amount, label_url, pickup_name, consignee, parcel, created_at')
    .eq('seller_id', uid)
    .order('created_at', { ascending: false })
    .limit(100)

  const shipments: ShipmentRow[] = (error ? [] : (data as any)) || []

  // Fetch product lines (title and quantity) for these orders
  const orderIds = Array.from(new Set(shipments.map(s => s.order_id).filter(Boolean)))
  const orderIdToLines: Record<string, Array<{ title: string; quantity: number }>> = {}
  if (orderIds.length > 0) {
    // 1) Try order_items
    const { data: items } = await supabase
      .from('order_items')
      .select('order_id, product_id, quantity')
      .in('order_id', orderIds as string[])

    // 2) Also read orders metadata to support flows without order_items
    const { data: ordersMeta } = await supabase
      .from('orders')
      .select('id, metadata')
      .in('id', orderIds as string[])

    // Collect all referenced product ids
    const productIds = new Set<string>()
    for (const it of items || []) productIds.add(it.product_id)
    for (const o of ordersMeta || []) {
      const md: any = (o as any).metadata || {}
      if (md?.product_id) productIds.add(String(md.product_id))
      const arr = Array.isArray(md?.items) ? md.items : []
      for (const r of arr) if (r?.product_id) productIds.add(String(r.product_id))
    }

    // 3) Fetch product titles
    let productIdToTitle: Record<string, string> = {}
    if (productIds.size > 0) {
      const { data: products } = await supabase
        .from('products')
        .select('id, title')
        .in('id', Array.from(productIds))
      productIdToTitle = Object.fromEntries(((products || []) as Array<{ id: string; title: string }>).
        map((p: { id: string; title: string }) => [p.id, p.title])
      )
    }

    // 4) Build lines from order_items
    for (const it of items || []) {
      const list = orderIdToLines[it.order_id] || (orderIdToLines[it.order_id] = [])
      const title = productIdToTitle[it.product_id] || 'Product'
      list.push({ title, quantity: it.quantity })
    }

    // 5) Fallback: build lines from orders.metadata
    for (const o of ordersMeta || []) {
      const list = orderIdToLines[o.id] || (orderIdToLines[o.id] = [])
      const md: any = (o as any).metadata || {}
      if (Array.isArray(md?.items) && md.items.length > 0) {
        for (const r of md.items) {
          const title = productIdToTitle[r?.product_id] || r?.name || 'Product'
          const qty = typeof r?.quantity === 'number' ? r.quantity : 1
          list.push({ title, quantity: qty })
        }
        continue
      }
      if (md?.product_id) {
        const title = productIdToTitle[String(md.product_id)] || md?.product_name || 'Product'
        const qty = typeof md?.quantity === 'number' ? md.quantity : 1
        list.push({ title, quantity: qty })
      }
    }
  }
  const counts = {
    total: shipments.length,
    shipped: shipments.filter(s => (s.status || '').toLowerCase().includes('shipped')).length,
    delivered: shipments.filter(s => (s.status || '').toLowerCase().includes('delivered')).length,
    pending: shipments.filter(s => !(s.status || '').toLowerCase().includes('shipped') && !(s.status || '').toLowerCase().includes('delivered')).length,
  }

  const sp = await searchParams
  const cancelStatus = typeof sp?.cancel === 'string' ? sp.cancel : undefined
  const pickupStatus = typeof sp?.pickup === 'string' ? sp.pickup : undefined
  const reason = typeof sp?.reason === 'string' ? sp.reason : undefined
  const walletLow = reason === 'wallet_low'
  const walletBalance = typeof sp?.wallet_balance === 'string' ? sp.wallet_balance : undefined
  const walletMin = typeof sp?.wallet_min === 'string' ? sp.wallet_min : undefined

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/seller/dashboard" className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {(cancelStatus || pickupStatus) && (
        <Flash
          message={
            cancelStatus === 'success'
              ? 'Shipment cancelled successfully.'
              : cancelStatus === 'failed'
              ? `Shipment cancellation failed${reason ? `: ${reason}` : ''}.`
              : pickupStatus === 'scheduled'
              ? 'Pickup scheduled successfully.'
              : pickupStatus === 'failed' && walletLow
              ? `Pickup failed: Low wallet balance (₹${walletBalance ?? '—'}). Minimum required is ₹${walletMin ?? '—'}. Please top up your Delhivery wallet and try again.`
              : pickupStatus === 'failed'
              ? `Pickup failed${reason ? `: ${decodeURIComponent(reason)}` : ''}.`
              : ''
          }
          variant={cancelStatus === 'failed' || pickupStatus === 'failed' ? 'error' : cancelStatus === 'success' || pickupStatus === 'scheduled' ? 'success' : 'info'}
          durationMs={5000}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Management
          </CardTitle>
          <CardDescription>
            {shipments.length} order{shipments.length !== 1 ? 's' : ''} for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here once customers purchase your products</p>
            </div>
          ) : (
            <div className="space-y-4">
              {shipments.map((s) => (
                <div key={s.id} className={`relative border rounded-xl p-4 bg-white hover:shadow-xs transition ${String(s.status).toLowerCase().includes('cancel') ? 'opacity-70' : ''}`}>
                  {String(s.status).toLowerCase().includes('cancel') && (
                    <div className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">Cancelled</div>
                  )}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">Order {s.order_id}</h3>
                        <span className="text-xs text-gray-500">· AWB {s.awb}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(s.status)}`}>{s.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(s.created_at).toLocaleDateString()} at {new Date(s.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <Link
                        href={`/seller/pickup/${encodeURIComponent(s.awb)}`}
                        className="px-3 py-1.5 rounded-md text-sm bg-[#2B5219] text-white hover:bg-[#1a3110]"
                        title="Schedule Pickup"
                      >
                        Schedule Pickup
                      </Link>
                      <a
                        href={`/api/shipments/${encodeURIComponent(s.awb)}/label?size=4R`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
                        title="Print Shipping Label"
                      >
                        <Printer className="h-4 w-4" /> Label
                      </a>
                      <a
                        href={`/api/shipments/${encodeURIComponent(s.awb)}/invoice`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-700 hover:bg-gray-50"
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" /> Invoice
                      </a>
                      <CancelShipmentButton awb={s.awb} disabled={String(s.status).toLowerCase().includes('cancel')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-900 leading-tight">Shipping Address</p>
                      <p className="text-sm text-gray-700 leading-tight">
                        {s.consignee?.address || '—'}{s.consignee?.city ? `, ${s.consignee.city}` : ''}{s.consignee?.state ? `, ${s.consignee.state}` : ''}{s.consignee?.pincode ? ` - ${s.consignee.pincode}` : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 leading-tight mt-2 md:mt-6">Payment</p>
                      <p className="text-sm text-gray-700 leading-tight">{s.payment_mode || 'Prepaid'} {s.payment_mode === 'COD' && s.cod_amount ? `(₹${s.cod_amount})` : ''}</p>
                    </div>
                  </div>
                  {/* Items list */}
                  {Array.isArray(orderIdToLines[s.order_id]) && orderIdToLines[s.order_id].length > 0 && (
                    <div className="mt-3 md:mt-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 leading-tight mb-2">Products and quantity</p>
                      <ul className="list-disc ml-5 md:ml-6 text-base md:text-lg text-gray-900 leading-relaxed">
                        {orderIdToLines[s.order_id].map((ln, idx) => (
                          <li key={`${s.order_id}-${idx}`} className="mb-0.5 md:mb-1"><span className="font-medium">{ln.title}</span> <span className="text-gray-600">×</span> <span className="font-bold">{ln.quantity}</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{counts.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{counts.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{counts.shipped}</p>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{counts.delivered}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}