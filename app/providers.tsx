'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import React from 'react'
import { AuthProvider } from '@/components/auth/auth-provider'
import { CartProvider } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export function Providers({ children }: { children: React.ReactNode }) {
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


