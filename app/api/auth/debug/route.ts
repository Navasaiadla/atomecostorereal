export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
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
      timestamp: new Date().toISOString(),
      cookies: {
        total: allCookies.length,
        supabase: supabaseCookies.map(c => ({ 
          name: c.name, 
          value: c.value.substring(0, 20) + '...',
          // Next.js RequestCookie doesn't expose path/expires in this context
          path: undefined,
          expires: undefined
        }))
      },
      session: {
        exists: !!session,
        error: sessionError?.message,
        expires_at: session?.expires_at,
        refresh_token: !!session?.refresh_token,
        access_token: !!session?.access_token
      },
      user: {
        exists: !!user,
        error: userError?.message,
        id: user?.id,
        email: user?.email,
        created_at: user?.created_at
      },
      authenticated: !!(session && user),
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'referer': request.headers.get('referer'),
        'origin': request.headers.get('origin')
      }
    })

  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      error: 'Auth debug failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

