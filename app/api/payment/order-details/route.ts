import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Return order amount by Razorpay order id, formatted and in rupees
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const razorpayOrderId = searchParams.get('order_id')
    if (!razorpayOrderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    // Support both schemas: amount in minor units or rupees; presence of total_amount in some schemas
    const { data, error } = await supabase
      .from('orders')
      .select('amount, total_amount')
      .eq('razorpay_order_id', razorpayOrderId)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const rawAmount = (data as any).amount ?? (data as any).total_amount
    const amountMinor = typeof rawAmount === 'number' ? rawAmount : Number(rawAmount)
    // If stored as minor units (paise), convert; assume >= 1000 likely minor units
    const amountRupees = Number.isFinite(amountMinor)
      ? (amountMinor >= 1000 ? Math.round(amountMinor) / 100 : amountMinor)
      : null

    return NextResponse.json({
      success: true,
      amountRupees,
      amountFormatted: typeof amountRupees === 'number' ? `₹${amountRupees}` : undefined,
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load order amount' }, { status: 500 })
  }
}


