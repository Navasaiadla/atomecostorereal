import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'
import { getDelhiveryConfig, cancelShipment } from '@/lib/delhivery'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, context: { params: Promise<{ awb: string }> }) {
  const { awb: awbRaw } = await context.params
  const awb = decodeURIComponent(awbRaw)
  if (!awb) return NextResponse.json({ ok: false, error: 'awb_required' }, { status: 400 })

  const supabase = await createServerSupabaseClient()
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth?.user?.id || null
  if (!uid) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  // Verify ownership and fetch current status
  const { data: row, error } = await supabase
    .from('shipments')
    .select('id, order_id, seller_id, status')
    .eq('awb', awb)
    .maybeSingle()
  if (error || !row) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  if (row.seller_id !== uid) return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })

  const current = (row.status || '').toLowerCase()
  if (current.includes('cancel') || current.includes('delivered') || current.includes('shipped')) {
    return NextResponse.json({ ok: false, error: 'not_cancellable' }, { status: 409 })
  }

  try {
    const cfg = getDelhiveryConfig()
    const provider = await cancelShipment(cfg, awb)

    // Validate provider acknowledgement
    const ok = (() => {
      const d: any = provider?.data || {}
      if (provider.status >= 200 && provider.status < 300) {
        // Look for explicit flags
        if (d?.success === true || d?.status === 'success') return true
        if (d?.Status && String(d.Status).toLowerCase().includes('success')) return true
        // Fallback: scan text
        const text = (JSON.stringify(d) || '').toLowerCase()
        return (
          text.includes('success') ||
          text.includes('cancelled') ||
          text.includes('updated') ||
          text.includes('accepted')
        )
      }
      return false
    })()
    if (!ok) {
      const url = new URL('/seller/orders', req.url)
      url.searchParams.set('cancel', 'failed')
      const snippet = (() => {
        try { return JSON.stringify(provider?.data).slice(0, 120) } catch { return '' }
      })()
      if (snippet) url.searchParams.set('reason', snippet)
      return NextResponse.redirect(url.toString(), 303)
    }

    // Update local status to cancelled (RLS-enforced via user client)
    const upd = await supabase
      .from('shipments')
      .update({ status: 'cancelled' })
      .eq('awb', awb)

    if (upd.error) {
      return NextResponse.json({ ok: false, error: upd.error.message }, { status: 500 })
    }

    // Also mark the linked order cancelled using admin client
    if (row.order_id) {
      try {
        const admin = createAdminClient()
        await admin.from('orders').update({ status: 'cancelled' as any }).eq('id', row.order_id)
      } catch (_e) {}
    }

    // Redirect back to orders
    const url = new URL('/seller/orders', req.url)
    url.searchParams.set('cancel', 'success')
    return NextResponse.redirect(url.toString(), 303)
  } catch (e: any) {
    const url = new URL('/seller/orders', req.url)
    url.searchParams.set('cancel', 'failed')
    url.searchParams.set('reason', (e?.message || 'cancel_failed').slice(0, 120))
    return NextResponse.redirect(url.toString(), 303)
  }
}


