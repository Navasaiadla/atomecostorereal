import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json().catch(() => ({}))

    // Try to get user for attribution
    let userId: string | null = null
    try {
      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id ?? null
    } catch {}

    const {
      order_id,
      razorpay_payment_id,
      payment_status = 'failed',
      payment_method = 'razorpay',
      amount,
      raw_payload,
    } = body || {}

    // Attempt 1: schema with columns used by edge functions
    const attempt1 = await supabase
      .from('payments')
      .upsert({
        // denormalized payment log
        order_id,
        // @ts-ignore optional based on schema
        user_id: userId,
        razorpay_payment_id,
        status: payment_status,
        method: payment_method,
        amount,
        raw_payload,
      } as any, { onConflict: 'razorpay_payment_id' })
      .select('id')
      .maybeSingle()

    if (!attempt1.error) {
      return NextResponse.json({ success: true })
    }

    // Attempt 2: alternate schema defined in local typings
    const attempt2 = await supabase
      .from('payments')
      .insert({
        transaction_id: razorpay_payment_id || order_id || null,
        payment_status,
        payment_method,
        raw_payload: typeof raw_payload === 'string' ? raw_payload : JSON.stringify(raw_payload || body || {}),
      } as any)

    if (!attempt2.error) {
      return NextResponse.json({ success: true })
    }

    console.error('payments logging failed', { attempt1: attempt1.error, attempt2: attempt2.error })
    return NextResponse.json({ success: false, error: 'Could not record payment' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 })
  }
}


