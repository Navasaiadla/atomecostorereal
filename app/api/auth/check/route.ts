export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return NextResponse.json({
        authenticated: false,
        error: 'Session error',
        details: sessionError.message
      })
    }

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: 'No active session'
      })
    }

    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return NextResponse.json({
        authenticated: false,
        error: 'User error',
        details: userError.message
      })
    }

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'No user found'
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      session: {
        expires_at: session.expires_at,
        refresh_token: !!session.refresh_token
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({
      authenticated: false,
      error: 'Unexpected error',
      details: message
    }, { status: 500 })
  }
}


