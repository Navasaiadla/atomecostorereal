export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Temporarily bypass authentication check
    // TODO: Re-enable authentication when ready
    // const { data: { user }, error: userError } = await supabase.auth.getUser()
    // if (userError || !user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    // const { data: profile, error: profileError } = await supabase
    //   .from('profiles')
    //   .select('role')
    //   .eq('id', user.id)
    //   .single()
    // if (profileError || !profile || profile.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get products with pagination
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (productsError) {
      console.error('Error fetching products:', productsError)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: productsError.message },
        { status: 500 }
      )
    }

    // Get counts for different statuses
    const { count: totalProducts, error: totalError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      console.error('Error fetching total products count:', totalError)
    }

    const { count: activeProducts, error: activeError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (activeError) {
      console.error('Error fetching active products count:', activeError)
    }

    const { count: lowStockProducts, error: lowStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
              .lt('stock', 10)

    if (lowStockError) {
      console.error('Error fetching low stock products count:', lowStockError)
    }

    // Calculate total inventory value
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('products')
              .select('price, stock')

    let totalInventoryValue = 0
    if (!inventoryError && inventoryData) {
      const rows = (inventoryData as Array<{ price: number | null; stock: number | null }>)
      totalInventoryValue = rows.reduce(
        (sum: number, product: { price: number | null; stock: number | null }) => sum + ((product.price ?? 0) * (product.stock ?? 0)),
        0
      )
    } else if (inventoryError) {
      console.error('Error fetching inventory data:', inventoryError)
    }

    return NextResponse.json({
      products: products || [],
      stats: {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        lowStockProducts: lowStockProducts || 0,
        totalInventoryValue: totalInventoryValue
      }
    })

  } catch (error) {
    console.error('Error in products route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
