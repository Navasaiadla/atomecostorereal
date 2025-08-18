import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
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

    // Get request body
    const { sellerId, newRole } = await request.json()

    if (!sellerId || !newRole) {
      return NextResponse.json(
        { error: 'Missing sellerId or newRole' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['seller', 'pending_seller', 'rejected_seller']
    if (!validRoles.includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Update seller role
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', sellerId)
      .select()

    if (error) {
      console.error('Error updating seller role:', error)
      return NextResponse.json(
        { error: 'Failed to update seller role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: `Seller role updated to ${newRole}` 
    })

  } catch (error) {
    console.error('Error in update-role route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
