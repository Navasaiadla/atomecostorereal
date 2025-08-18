import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerOnlyClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let browserClient: SupabaseClient<Database> | null = null

function createNoopClient(): SupabaseClient<Database> {
  const thenable = {
    select() { return this },
    upsert() { return this },
    insert() { return this },
    update() { return this },
    delete() { return this },
    eq() { return this },
    order() { return this },
    single() { return this },
    limit() { return this },
    range() { return this },
    then(onFulfilled: (v: any) => any) {
      return Promise.resolve({ data: null, error: new Error('Supabase not configured') }).then(onFulfilled)
    },
    catch(onRejected: (e: any) => any) {
      return Promise.resolve({ data: null, error: new Error('Supabase not configured') }).catch(onRejected)
    },
  }
  const mock: any = {
    from() { return thenable },
    storage: {
      from() { return { getPublicUrl(path: string) { return { data: { publicUrl: path }, error: null } } } },
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      signInWithOtp: async () => ({ error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: { message: 'Supabase not configured' } }),
    },
  }
  return mock as SupabaseClient<Database>
}

// Client-side Supabase client (singleton)
export function createClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createNoopClient()
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return browserClient
}

// Admin client for server-only operations (uses service role key). Do NOT import in client components.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  return createServerOnlyClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Legacy named export: provide a lazy proxy so existing imports `import { supabase } from './supabase'` keep working
// This avoids instantiating the browser client until a property is accessed at runtime (client-side)
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = createClient()
    // @ts-expect-error - dynamic property access on Supabase client
    return client[prop]
  },
}) as unknown as SupabaseClient<Database>