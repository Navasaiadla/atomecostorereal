import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Server-side Supabase client (for API routes and Server Components)
export async function createServerSupabaseClient() {
  if (!isConfigured) {
    // Safe mock that behaves like a thenable query builder and resolves to empty results
    const thenable = {
      select() { return this },
      eq() { return this },
      order() { return this },
      single() { return this },
      limit() { return this },
      range() { return this },
      // Thenable interface so `await` works at any chain depth
      then(onFulfilled: (v: any) => any) {
        return Promise.resolve({ data: null, error: new Error('Supabase not configured') }).then(onFulfilled)
      },
      catch(onRejected: (e: any) => any) {
        return Promise.resolve({ data: null, error: new Error('Supabase not configured') }).catch(onRejected)
      },
    }
    const mock = {
      from() { return thenable },
      auth: {
        getUser() { return Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }) },
        getSession() { return Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }) },
      },
      storage: {
        from() {
          return {
            getPublicUrl(path: string) {
              return { data: { publicUrl: path }, error: null }
            },
          }
        },
      },
    } as any
    return mock
  }

  const cookieStore = await cookies()
  return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}