import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest, context: { params: Promise<{ awb: string }> }) {
  const { awb: awbRaw } = await context.params
  const awb = decodeURIComponent(awbRaw)
  if (!awb || awb.trim().length === 0) {
    return NextResponse.json({ error: 'awb required' }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    // Shipment row (seller_id, order_id, consignee, parcel, etc.)
    const { data: shipment, error: shipErr } = await admin
      .from('shipments')
      .select('order_id, seller_id, awb, payment_mode, cod_amount, consignee, parcel, created_at')
      .eq('awb', awb)
      .single()
    if (shipErr || !shipment) {
      return NextResponse.json({ error: 'shipment_not_found' }, { status: 404 })
    }

    // Order metadata (amount and items fallback)
    const { data: orderRow } = await admin
      .from('orders')
      .select('id, amount, currency, metadata')
      .eq('id', shipment.order_id)
      .maybeSingle()

    // Items via order_items, with fallback to orders.metadata
    const { data: orderItems } = await admin
      .from('order_items')
      .select('product_id, quantity, unit_price')
      .eq('order_id', shipment.order_id)

    // Resolve product titles
    const productIds = new Set<string>()
    for (const it of orderItems || []) productIds.add(it.product_id as any)
    const md: any = (orderRow?.metadata as any) || {}
    if (Array.isArray(md.items)) for (const r of md.items) if (r?.product_id) productIds.add(String(r.product_id))
    if (md?.product_id) productIds.add(String(md.product_id))

    let productIdToTitle: Record<string, string> = {}
    if (productIds.size > 0) {
      const { data: products } = await admin
        .from('products')
        .select('id, title')
        .in('id', Array.from(productIds))
      productIdToTitle = Object.fromEntries(((products || []) as Array<{ id: string; title: string }>).
        map((p: { id: string; title: string }) => [p.id, p.title]))
    }

    // Build lines
    type Line = { title: string; quantity: number; unit_price: number; total: number }
    const lines: Line[] = []
    for (const it of orderItems || []) {
      const title = productIdToTitle[it.product_id] || 'Product'
      const qty = Number(it.quantity || 1)
      const unit = Number(it.unit_price || 0)
      lines.push({ title, quantity: qty, unit_price: unit, total: unit * qty })
    }
    if (lines.length === 0) {
      if (Array.isArray(md.items) && md.items.length > 0) {
        for (const r of md.items) {
          const qty = typeof r?.quantity === 'number' ? r.quantity : 1
          const unit = Number(r?.unit_price || r?.price || 0)
          const title = productIdToTitle[r?.product_id] || r?.name || 'Product'
          lines.push({ title, quantity: qty, unit_price: unit, total: unit * qty })
        }
      } else if (md?.product_id) {
        const qty = typeof md?.quantity === 'number' ? md.quantity : 1
        const unit = Number(md?.unit_price || md?.price || orderRow?.amount || 0)
        const title = productIdToTitle[String(md.product_id)] || md?.product_name || 'Product'
        lines.push({ title, quantity: qty, unit_price: unit, total: unit * qty })
      }
    }

    // Normalize subtotal: if orders.amount is in paise, convert to rupees for display
    const rawSubtotal = lines.reduce((s, l) => s + l.total, 0)
    const currency = (orderRow?.currency || 'INR') as string
    const subtotal = rawSubtotal > 1000 ? Math.round(rawSubtotal) / 100 : rawSubtotal
    const payMode = (shipment.payment_mode || 'Prepaid') as string
    const codAmount = Number(shipment.cod_amount || 0)
    const createdDate = new Date(shipment.created_at)

    // Try user-provided HTML template from /public; fall back to built-in
    const templatePaths = [
      path.join(process.cwd(), 'public', 'invoice-template.html'),
      path.join(process.cwd(), 'public', 'templates', 'invoice.html'),
      path.join(process.cwd(), 'public', 'invoices', 'template.html'),
    ]

    let externalTemplate: string | null = null
    for (const p of templatePaths) {
      try {
        const buf = await fs.readFile(p)
        externalTemplate = buf.toString('utf8')
        if (externalTemplate) break
      } catch (_) {}
    }

    const itemRowsHtml = lines
      .map(l => `<tr><td>${escapeHtml(l.title)}</td><td>${l.quantity}</td><td>${formatCurrency(l.unit_price, currency)}</td><td>${formatCurrency(l.total, currency)}</td></tr>`)
      .join('')

    let html: string
    if (externalTemplate) {
      // Replace known placeholders in the provided template
      const md: any = (orderRow?.metadata as any) || {}
      const ship: any = shipment.consignee || {}
      const replacements: Record<string, string> = {
        '{{AWB}}': awb,
        '{{ORDER_ID}}': String(shipment.order_id || ''),
        '{{PAYMENT_MODE}}': String(payMode),
        '{{COD_AMOUNT}}': payMode === 'COD' ? formatCurrency(codAmount, currency) : '',
        '{{CURRENCY}}': currency,
        '{{CREATED_AT}}': createdDate.toLocaleString(),
        '{{SELLER_ID}}': String(shipment.seller_id || ''),
        '{{SUBTOTAL}}': formatCurrency(subtotal, currency),
        '{{CONSINGEE_NAME}}': String(ship?.name || ''),
        '{{CONSIGNEE_NAME}}': String(ship?.name || ''),
        '{{CONSIGNEE_ADDRESS}}': String(ship?.address || ''),
        '{{CONSIGNEE_CITY}}': String(ship?.city || ''),
        '{{CONSIGNEE_STATE}}': String(ship?.state || ''),
        '{{CONSIGNEE_PINCODE}}': String(ship?.pincode || ''),
        '{{CONSIGNEE_PHONE}}': String(ship?.phone || ''),
        '{{CONSIGNEE_EMAIL}}': String(ship?.email || ''),
        '{{ITEM_ROWS}}': itemRowsHtml,
        '{{ITEMS}}': itemRowsHtml,
        '{{SHIPPING_NAME}}': String(md?.shipping?.name || ship?.name || ''),
        '{{SHIPPING_EMAIL}}': String(md?.shipping?.email || ship?.email || ''),
        '{{SHIPPING_PHONE}}': String(md?.shipping?.phone || ship?.phone || ''),
      }
      let rendered = externalTemplate
      for (const [k, v] of Object.entries(replacements)) {
        rendered = rendered.split(k).join(v)
      }
      html = rendered
    } else {
      // Simple printable HTML invoice
      html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Invoice - ${awb}</title>
  <style>
    :root { --brand: #2B5219; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: #111827; margin: 0; }
    .container { max-width: 800px; margin: 24px auto; padding: 16px; }
    .card { border: 1px solid #E5E7EB; border-radius: 10px; overflow: hidden; }
    .header { background: #F9FAFB; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
    .section { padding: 16px; }
    h1 { font-size: 20px; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; }
    th { background: #F9FAFB; font-weight: 600; }
    .totals { text-align: right; }
    .muted { color: #6B7280; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #ECFDF5; color: #065F46; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .sm { font-size: 12px; }
    @media print {
      .no-print { display: none; }
      .container { margin: 0; padding: 0; }
      body { background: white; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div>
          <h1>Invoice</h1>
          <div class="sm muted">AWB: ${awb}</div>
          <div class="sm muted">Order: ${shipment.order_id || '-'}</div>
        </div>
        <div>
          <span class="badge">${payMode}${payMode === 'COD' ? ` ₹${codAmount}` : ''}</span>
        </div>
      </div>

      <div class="section grid">
        <div>
          <div class="muted sm" style="margin-bottom:4px;">Shipping To</div>
          <div><strong>${(shipment.consignee as any)?.name || '-'}</strong></div>
          <div class="sm">${(shipment.consignee as any)?.address || '-'}</div>
          <div class="sm">${(shipment.consignee as any)?.city || ''} ${(shipment.consignee as any)?.state || ''} ${(shipment.consignee as any)?.pincode || ''}</div>
          <div class="sm">${(shipment.consignee as any)?.phone || ''} ${(shipment.consignee as any)?.email ? '· ' + (shipment.consignee as any)?.email : ''}</div>
        </div>
        <div>
          <div class="muted sm" style="margin-bottom:4px;">Meta</div>
          <div class="sm">Date: ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}</div>
          <div class="sm">Seller: ${shipment.seller_id || '-'}</div>
        </div>
      </div>

      <div class="section">
        <table>
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${itemRowsHtml}
          </tbody>
          <tfoot>
            <tr><td colspan="3" class="totals"><strong>Subtotal</strong></td><td>${formatCurrency(subtotal, currency)}</td></tr>
          </tfoot>
        </table>
      </div>

      <div class="section muted sm">Generated by AtomEcoStore</div>
    </div>
    <div class="no-print" style="margin-top:12px;text-align:right;">
      <button onclick="window.print()" style="background: var(--brand); color: white; border: 0; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Print</button>
    </div>
  </div>
</body>
</html>`
    }

    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed_to_render_invoice' }, { status: 500 })
  }
}

function escapeHtml(input: string): string {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
  } catch {
    return `₹${Math.round(Number(amount || 0))}`
  }
}


