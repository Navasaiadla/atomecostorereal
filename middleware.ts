import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Allow API routes and static assets to pass through quickly
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  // If Supabase env is missing, do not gate
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // IMPORTANT: always mutate the same response so cookies propagate on redirects
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = pathname.startsWith('/admin')
  const isSellerRoute = pathname.startsWith('/seller')
  const isOrdersRoute = pathname.startsWith('/orders')

  // Public auth pages
  const publicAuthPaths = ['/login', '/register', '/auth/callback']
  const isPublicAuthPath = publicAuthPaths.some((p) => pathname.startsWith(p))

  // Temporarily bypass authentication for admin routes
  // TODO: Re-enable authentication when ready
  if (isAdminRoute) {
    return response
  }

  // If unauthenticated and hitting protected areas, send to login with next
  // Protect orders page as well
  if (!user && isAdminRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    response = NextResponse.redirect(loginUrl)
    return response
  }

  if (!user && isOrdersRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    response = NextResponse.redirect(loginUrl)
    return response
  }

  // If no user, allow
  if (!user) {
    return response
  }

  // Fetch role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id as string)
    .single()

  const role = (profile?.role as 'admin' | 'seller' | 'customer' | undefined) || 'customer'

  // If the user is already signed in and on a public auth page, redirect them away
  // EXCEPT allow `/auth/callback` so users can complete password reset without being bounced
  if (user && isPublicAuthPath && pathname !== '/auth/callback') {
    const dest = role === 'admin' ? '/admin/dashboard' : '/'
    response = NextResponse.redirect(new URL(dest, request.url))
    return response
  }

  // Strict gating for section roots
  if (isAdminRoute && role !== 'admin') {
    const dest = role === 'seller' ? '/seller/dashboard' : '/'
    response = NextResponse.redirect(new URL(dest, request.url))
    return response
  }

  // Remove seller role gating - allow all users to access seller routes
  // if (isSellerRoute && role !== 'seller') {
  //   const dest = role === 'admin' ? '/admin/dashboard' : '/'
  //   response = NextResponse.redirect(new URL(dest, request.url))
  //   return response
  // }

  // Enforce role-specific experience across the site
  // Admins should only see admin pages; Sellers only seller pages; Buyers the storefront
  if (!isPublicAuthPath) {
    if (role === 'admin' && !isAdminRoute) {
      response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
      return response
    }
    // Remove seller role enforcement - allow all users to access seller routes
    // if (role === 'seller' && !isSellerRoute) {
    //   response = NextResponse.redirect(new URL('/seller/dashboard', request.url))
    //   return response
    // }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 