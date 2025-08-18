export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return NextResponse.json({
        authenticated: false,
        error: sessionError.message,
        timestamp: new Date().toISOString()
      })
    }

    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'No active session',
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      )
    }

    // Get user profile if authenticated
    let profile = null
    if (session.user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id as any)
          .single()
        
        if (!profileError) {
          profile = profileData
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user?.id,
        email: session.user?.email,
        email_confirmed_at: session.user?.email_confirmed_at,
        created_at: session.user?.created_at
      },
      profile,
      session: {
        access_token: session.access_token ? 'Present' : 'Missing',
        refresh_token: session.refresh_token ? 'Present' : 'Missing',
        expires_at: session.expires_at
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Auth status check error:', error)
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Failed to check authentication status',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

