'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import React, { useMemo } from 'react'
import { AuthProvider } from '@/components/auth/auth-provider'
import { CartProvider } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase'

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </SessionContextProvider>
  )
}


