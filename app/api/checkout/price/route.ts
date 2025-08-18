import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Returns computed price for the current user's cart (per-item lines + totals)
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const singleProductId = searchParams.get('productId')
    const qtyParam = Number(searchParams.get('qty') || '1') || 1
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    let items: any[] = []
    if (singleProductId) {
      const { data: product, error: perr } = await supabase
        .from('products')
        .select('id, title, price')
        .eq('id', singleProductId)
        .single()
      if (perr || !product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      items = [{
        id: `direct-${product.id}`,
        product_id: product.id,
        title: product.title,
        unit_price: Number(product.price || 0),
        quantity: qtyParam,
        line_total: Number(product.price || 0) * qtyParam,
      }]
    } else {
      const { data: cartItems, error } = await supabase
        .from('cart')
        .select(`id, quantity, products(id, title, price)`) 
        .eq('user_id', user.id)
      if (error) throw error
      items = (cartItems || []).map((c: any) => ({
        id: c.id,
        product_id: c.products?.id,
        title: c.products?.title,
        unit_price: Number(c.products?.price || 0),
        quantity: Number(c.quantity || 0),
        line_total: Number(c.products?.price || 0) * Number(c.quantity || 0),
      }))
    }
    const subtotal = items.reduce((s: number, i: any) => s + i.line_total, 0)
    const shipping = subtotal >= 500 ? 0 : (subtotal > 0 ? 50 : 0)
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + shipping + tax
    return NextResponse.json({ items, subtotal, shipping, tax, total })
  } catch (e) {
    console.error('Checkout price API error:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


