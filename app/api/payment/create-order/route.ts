import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Proxy this route to Supabase Edge Function `payments-create-order`
export async function POST(request: NextRequest) {
  const secret = process.env.EDGE_FUNCTIONS_SHARED_SECRET
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!secret || !supabaseUrl) {
    return NextResponse.json({ error: 'Server not configured to call edge function' }, { status: 500 })
  }

  const body = await request.json()
  const amount = Number(body?.amount)
  let idempotencyKey = (body?.app_order_id && typeof body.app_order_id === 'string')
    ? body.app_order_id
    : crypto.randomUUID()
  // Ensure it's a UUID to satisfy edge function schema
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(idempotencyKey)) idempotencyKey = crypto.randomUUID()
  const transformed = {
    ...body,
    amount: Number.isFinite(amount) ? Math.round(amount * 100) : amount,
    idempotency_key: idempotencyKey,
  }
  // amount should be in minor units already on client; if you used rupees, multiply by 100 at caller

  // Derive the user's access token from cookies so orders get a non-null user_id
  let authHeader = request.headers.get('Authorization') || undefined
  try {
    if (!authHeader) {
      const supabase = await createServerSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) authHeader = `Bearer ${session.access_token}`
    }
  } catch {}
  const resp = await fetch(`${supabaseUrl}/functions/v1/payments-create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Secret': secret,
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
    body: JSON.stringify(transformed),
  })

  const text = await resp.text()
  const data = (() => { try { return JSON.parse(text) } catch { return { raw: text } } })()

  if (resp.ok && data?.razorpayOrderId && data?.amount && data?.currency) {
    // Normalize to the shape expected by the client Razorpay button
    const normalized = {
      success: true,
      order: {
        id: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency,
        receipt: data.orderId, // local order UUID stored as receipt in provider
      },
    }
    return NextResponse.json(normalized, { status: 200 })
  }

  return NextResponse.json(data, { status: resp.status })
}