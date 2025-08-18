"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

interface CartItem {
  id: string
  product_id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  quantity: number
  image: string
  tag: string
  stock: number
  is_active: boolean
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  isLoading: boolean
  error: string | null
  successMessage: string | null
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  refreshCart: () => Promise<void>
  clearError: () => void
  clearSuccess: () => void
  clearCart?: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
      return headers
    } catch {
      return { 'Content-Type': 'application/json' }
    }
  }

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', { credentials: 'include', headers })
      if (response.status === 401) {
        // Not logged in; keep empty cart (DB cart is auth-only)
        setItems([])
        setTotalItems(0)
        return
      }
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }

      const data = await response.json()
      const fetchedItems: CartItem[] = data.items || []
      setItems(fetchedItems)
      setTotalItems(fetchedItems.reduce((sum, i) => sum + i.quantity, 0))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart')
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchCart()
  }, [])

  // Subscribe to realtime cart changes for logged-in user
  useEffect(() => {
    const supabase = createClient()
    let unsubscribed = false
    let channel: any

    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        if (unsubscribed) return

        channel = supabase
          .channel('cart_changes')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'cart', filter: `user_id=eq.${user.id}` },
            () => {
              // Refresh cart when user's cart changes
              fetchCart()
            }
          )
          .subscribe()
      } catch {
        // ignore
      }
    })()

    return () => {
      unsubscribed = true
      try {
        if (channel) {
          const supabase = createClient()
          supabase.removeChannel(channel)
        }
      } catch {}
    }
  }, [])

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers,
        body: JSON.stringify({ product_id: productId, quantity }),
        credentials: 'include',
      })

      if (response.status === 401) {
        setError('Please login to add items to cart')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to add item to cart')
      }

      // Optimistic-ish update using enriched response when available
      const resJson = await response.json().catch(() => ({} as any))
      const returnedItem = (resJson && resJson.item) ? resJson.item as any : null
      if (returnedItem) {
        setItems(prev => {
          const idx = prev.findIndex(i => i.id === returnedItem.id)
          const next = [...prev]
          if (idx >= 0) next[idx] = { ...(next[idx] as any), ...returnedItem }
          else next.unshift(returnedItem as any)
          return next
        })
        setTotalItems(prev => prev + Number(quantity || 1))
      } else {
        await fetchCart()
      }
      setSuccessMessage('Item added to cart successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ cart_item_id: cartItemId, quantity }),
        credentials: 'include',
      })

      if (response.status === 401) {
        setError('Please login to update cart')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update quantity')
      }

      const resJson = await response.json().catch(() => ({} as any))
      const returnedItem = (resJson && resJson.item) ? resJson.item as any : null
      if (returnedItem) {
        setItems(prev => prev.map(i => i.id === returnedItem.id ? { ...(i as any), ...returnedItem } : i))
        setTotalItems(prev => {
          const oldItem = items.find(i => i.id === (returnedItem as any).id)
          const oldQty = oldItem ? Number(oldItem.quantity || 0) : 0
          const newQty = Number(returnedItem.quantity || 0)
          return prev - oldQty + newQty
        })
      } else {
        await fetchCart()
      }
      setSuccessMessage('Cart updated successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      const headers = await getAuthHeaders()
      const response = await fetch(`/api/cart?cart_item_id=${encodeURIComponent(cartItemId)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers,
      })

      if (response.status === 401) {
        setError('Please login to remove items from cart')
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to remove item')
      }

      await fetchCart()
      setSuccessMessage('Item removed from cart successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshCart = async () => {
    await fetchCart()
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccessMessage(null)

  const clearCart = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)
      const headers = await getAuthHeaders()
      const response = await fetch('/api/cart/clear', {
        method: 'POST',
        headers,
        credentials: 'include',
      })
      if (response.status === 401) {
        setError('Please login to clear cart')
        return
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to clear cart')
      }
      await fetchCart()
      setSuccessMessage('Cart cleared successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart')
    } finally {
      setIsLoading(false)
    }
  }

  const value: CartContextType = {
    items,
    totalItems,
    isLoading,
    error,
    successMessage,
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    clearError,
    clearSuccess,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
