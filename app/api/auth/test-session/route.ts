import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get all cookies
    const allCookies = cookieStore.getAll()
    const supabaseCookies = allCookies.filter(cookie => 
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase') ||
      cookie.name.includes('auth')
    )
    
    // Check session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    // Check user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    return NextResponse.json({
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }))
      },
      session: {
        exists: !!session,
        error: sessionError?.message,
        expires_at: session?.expires_at,
        refresh_token: !!session?.refresh_token
      },
      user: {
        exists: !!user,
        error: userError?.message,
        id: user?.id,
        email: user?.email
      },
      authenticated: !!(session && user)
    })

  } catch (error) {
    console.error('Session test error:', error)
    return NextResponse.json({
      error: 'Session test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

