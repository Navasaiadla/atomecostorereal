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
    const role = searchParams.get('role')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .neq('role', 'admin')
      .order('created_at', { ascending: false })

    // Filter by role if specified
    if (role) {
      query = query.eq('role', role)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: sellers, error } = await query

    if (error) {
      console.error('Error fetching sellers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch sellers' },
        { status: 500 }
      )
    }

    // Get counts for different roles
    const { count: totalSellers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .neq('role', 'admin')

    const { count: pendingSellers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'pending_seller')

    const { count: approvedSellers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'seller')

    return NextResponse.json({
      sellers: sellers || [],
      counts: {
        total: totalSellers || 0,
        pending: pendingSellers || 0,
        approved: approvedSellers || 0
      }
    })

  } catch (error) {
    console.error('Error in sellers route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
