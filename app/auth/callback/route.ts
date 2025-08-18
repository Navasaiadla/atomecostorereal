import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase'

// Single GET handler: handles both OAuth code exchange and password reset redirect
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  // If Supabase sent password-reset session via hash, redirect to reset UI
  if (requestUrl.hash) {
    return NextResponse.redirect(new URL('/auth/reset', requestUrl.origin))
  }
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session?.user) {
      console.log('🔍 Auth callback - User ID:', session.user.id)
      try {
        // Get user role from profiles table
        const adminClient = createAdminClient()
        const { data: profile } = await adminClient
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        const role = profile?.role || 'customer'
        console.log('✅ Auth callback - User role:', role)
        
        // Redirect based on role
        switch (role) {
          case 'admin':
            console.log('🚀 Auth callback - Redirecting admin to /admin/dashboard')
            return NextResponse.redirect(`${requestUrl.origin}/admin/dashboard`)
          case 'seller':
            console.log('🚀 Auth callback - Redirecting seller to /seller/dashboard')
            return NextResponse.redirect(`${requestUrl.origin}/seller/dashboard`)
          default:
            console.log('🚀 Auth callback - Redirecting customer to /')
            return NextResponse.redirect(requestUrl.origin)
        }
      } catch (error) {
        console.error('❌ Auth callback - Error fetching user role:', error)
        // Fallback to home page if role fetch fails
        return NextResponse.redirect(requestUrl.origin)
      }
    }
  }

  // Fallback redirect to home page
  return NextResponse.redirect(requestUrl.origin)
} 