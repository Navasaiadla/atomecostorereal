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

    // Get current date for filtering
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total sellers (all roles except admin)
    const { count: totalSellers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .neq('role', 'admin')

    // Get pending sellers
    const { count: pendingSellers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'pending_seller')

    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Get orders today
    const { count: ordersToday } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())

    // Get orders this month
    const { count: ordersThisMonth } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thisMonth.toISOString())

    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'delivered')

    let totalRevenue = 0
    if (!revenueError && revenueData) {
      const rows = (revenueData as Array<{ total_amount: number | null }>)
      totalRevenue = rows.reduce((sum: number, order: { total_amount: number | null }) => sum + (order.total_amount ?? 0), 0)
    }

    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at, customer_id')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get top products
    const { data: topProducts, error: topProductsError } = await supabase
      .from('products')
              .select('id, title, price, stock')
        .order('stock', { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalSellers: totalSellers || 0,
        pendingSellers: pendingSellers || 0,
        totalProducts: totalProducts || 0,
        ordersToday: ordersToday || 0,
        ordersThisMonth: ordersThisMonth || 0,
        totalRevenue: totalRevenue
      },
      recentOrders: recentOrders || [],
      topProducts: topProducts || []
    })

  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
