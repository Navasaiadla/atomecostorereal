import { createBrowserClient } from '@supabase/ssr'
import { createClient as createServerOnlyClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let browserClient: SupabaseClient<Database> | null = null

// Client-side Supabase client (singleton)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
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