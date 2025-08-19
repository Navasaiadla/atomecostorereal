'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  role: 'customer' | 'seller' | 'admin' | null
  signIn: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  signUp: (email: string) => Promise<{ error: any }>
  signInWithPassword: (email: string, password: string) => Promise<{ error: any }>
  signUpWithPassword: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signInWithOAuth: (provider: 'google' | 'apple') => Promise<{ error: any }>
  isSupabaseAvailable: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false)
  const [role, setRole] = useState<'customer' | 'seller' | 'admin' | null>(null)
  const router = useRouter()
  const handledSignInRef = useRef(false)

  // Fetch user role from profiles table
  const getUserRole = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        return 'customer' as const
      }
      return (data?.role as 'customer' | 'seller' | 'admin') || 'customer'
    } catch {
      return 'customer' as const
    }
  }

  const redirectBasedOnRole = async (userId: string) => {
    const r = await getUserRole(userId)
    setRole(r)
    const url = new URL(window.location.href)
    const nextPath = url.searchParams.get('next')
    if (nextPath) {
      router.push(nextPath)
      return
    }
    if (r === 'admin') {
      router.push('/admin/dashboard')
      return
    }
    // For sellers and customers, land on home by default to avoid unexpected redirects
    router.push('/')
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setIsSupabaseAvailable(false)
          setLoading(false)
          return
        }
        setIsSupabaseAvailable(true)

        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          setRole(await getUserRole(session.user.id))
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user && !handledSignInRef.current) {
              handledSignInRef.current = true
              try {
                await fetch('/api/auth/create-profile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user: session.user }),
                })
                await redirectBasedOnRole(session.user.id)
              } catch (error) {
                console.error('Error creating profile:', error)
                await redirectBasedOnRole(session.user.id)
              }
            } else if (event === 'SIGNED_OUT') {
              handledSignInRef.current = false
              setRole(null)
              router.push('/')
            }
          }
        )

        setLoading(false)
        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Auth initialization error:', error)
        setIsSupabaseAvailable(false)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  const signIn = async (email: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      return { error }
    } catch (error) {
      return { error: { message: 'Failed to send magic link. Please try again.' } }
    }
  }

  const signUp = async (email: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      return { error }
    } catch (error) {
      return { error: { message: 'Failed to send magic link. Please try again.' } }
    }
  }

  const signInWithPassword = async (email: string, password: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error }
    } catch (error) {
      return { error: { message: 'Failed to sign in. Please try again.' } }
    }
  }

  const signUpWithPassword = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (error) {
      return { error: { message: 'Failed to create account. Please try again.' } }
    }
  }

  const signInWithOAuth = async (provider: 'google' | 'apple') => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      return { error }
    } catch (error) {
      return { error: { message: `Failed to sign in with ${provider}. Please try again.` } }
    }
  }

  const signOut = async () => {
    if (!isSupabaseAvailable) {
      return { error: { message: 'Supabase is not configured. Please check your environment variables.' } }
    }
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: { message: 'Failed to sign out. Please try again.' } }
    }
  }

  const value = {
    user,
    session,
    loading,
    role,
    signIn,
    signOut,
    signUp,
    signInWithPassword,
    signUpWithPassword,
    signInWithOAuth,
    isSupabaseAvailable,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 