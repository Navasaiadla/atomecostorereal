import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { verifyWebhookSignature } from '@/lib/delhivery'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Delhivery sends JSON payloads for status updates. We verify using HMAC if configured.
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    const signature = req.headers.get('x-delhivery-signature') || req.headers.get('x-webhook-signature')

    if (!verifyWebhookSignature(raw, signature)) {
      // If no secret is configured, you can choose to accept for testing by toggling this env
      const allowUnsigned = process.env.DELHIVERY_ALLOW_UNVERIFIED === 'true'
      if (!allowUnsigned) {
        return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(raw || '{}') as any
    // Normalized fields from common Delhivery webhook shapes
    const awb: string | null = payload?.waybill || payload?.awb || payload?.Shipment?.Waybill || null
    const statusText: string = (payload?.status || payload?.Status || payload?.Shipment?.Status || '').toString()
    const lowercase = statusText.toLowerCase()

    if (!awb) {
      return NextResponse.json({ ok: false, error: 'missing_awb' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Map provider statuses to our local statuses
    const localStatus = (() => {
      if (lowercase.includes('cancel')) return 'cancelled'
      if (lowercase.includes('rto')) return 'rto'
      if (lowercase.includes('delivered')) return 'delivered'
      if (lowercase.includes('in transit') || lowercase.includes('picked')) return 'in_transit'
      if (lowercase.includes('out for delivery')) return 'out_for_delivery'
      return 'updated'
    })()

    // Update shipments
    await admin.from('shipments').update({ status: localStatus, metadata: payload as any }).eq('awb', awb)

    // Optionally update linked order status for terminal states
    if (localStatus === 'delivered' || localStatus === 'cancelled') {
      try {
        const { data } = await admin.from('shipments').select('order_id').eq('awb', awb).maybeSingle()
        const orderId = (data as any)?.order_id
        if (orderId) {
          const next = localStatus === 'delivered' ? 'delivered' : 'cancelled'
          await admin.from('orders').update({ status: next as any }).eq('id', orderId)
        }
      } catch {}
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'webhook_failed' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/delhivery'

export const runtime = 'nodejs'

export async function POST(req: Request) {
	const signature = req.headers.get('x-delhivery-signature') || req.headers.get('x-hub-signature')
	const raw = await req.text()
	const valid = verifyWebhookSignature(raw, signature)
	if (!valid) return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })

	try {
		const payload = JSON.parse(raw)
		const event = {
			eventId: payload?.event_id || payload?.id || null,
			awb: payload?.awb || payload?.waybill || payload?.shipment?.waybill || null,
			status: payload?.status || payload?.current_status || null,
			description: payload?.remarks || payload?.description || null,
			eventTime: payload?.time || payload?.timestamp || new Date().toISOString(),
			location: payload?.location || null,
			raw: payload
		}
		return NextResponse.json({ ok: true, event })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || 'bad payload' }, { status: 400 })
	}
}

export async function GET() {
	return NextResponse.json({ ok: true })
}



