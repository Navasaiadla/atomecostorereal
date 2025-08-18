import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get all active products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, title, price, stock, is_active')
      .eq('is_active', true as any)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products: products || [], count: products?.length || 0 })

  } catch (error) {
    console.error('Products list API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

