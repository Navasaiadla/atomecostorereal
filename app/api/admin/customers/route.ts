export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
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

    // Get customers (users with role 'customer' or no specific role)
    const { data: customers, error: customersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .or('role.eq.customer,role.is.null')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (customersError) {
      console.error('Error fetching customers:', customersError)
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      )
    }

    // Get current date for filtering
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get counts for different metrics
    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .or('role.eq.customer,role.is.null')

    const { count: activeCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .or('role.eq.customer,role.is.null')

    const { count: newCustomersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .or('role.eq.customer,role.is.null')
      .gte('created_at', thisMonth.toISOString())

    // Get total orders from customers
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      customers: customers || [],
      stats: {
        totalCustomers: totalCustomers || 0,
        activeCustomers: activeCustomers || 0,
        newCustomersThisMonth: newCustomersThisMonth || 0,
        totalOrders: totalOrders || 0
      }
    })

  } catch (error) {
    console.error('Error in customers route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
