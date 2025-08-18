import { supabase } from './supabase'
import type { Database, Profile, Product, Order, CartItem } from './database.types'

// Authentication utilities
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, userData: Partial<Profile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Profile utilities
export const profiles = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Create user profile
  createProfile: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  }
}

// Product utilities
export const products = {
  // Get all products
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get product by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Get products by seller
  getBySeller: async (sellerId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create product
  create: async (product: Database['public']['Tables']['products']['Insert']) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    return { data, error }
  },

  // Update product
  update: async (id: string, updates: Database['public']['Tables']['products']['Update']) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Delete product
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// Cart utilities
export const cart = {
  // Get user's cart items
  getItems: async (userId: string) => {
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', userId)
    return { data, error }
  },

  // Add item to cart
  addItem: async (item: { user_id: string; product_id: string; quantity: number }) => {
    const { data, error } = await supabase
      .from('cart')
      .insert(item)
      .select()
      .single()
    return { data, error }
  },

  // Update cart item quantity
  updateQuantity: async (id: string, quantity: number) => {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Remove item from cart
  removeItem: async (id: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Clear user's cart
  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
    return { error }
  }
}

// Order utilities
export const orders = {
  // Get user's orders
  getUserOrders: async (customerId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get seller's orders
  getSellerOrders: async (sellerId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          products!inner(*)
        )
      `)
      .eq('order_items.products.seller_id', sellerId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create order
  create: async (order: Database['public']['Tables']['orders']['Insert']) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    return { data, error }
  },

  // Update order status
  updateStatus: async (id: string, status: Order['status']) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Update payment status
  updatePaymentStatus: async (id: string, paymentStatus: Order['payment_status'], razorpayPaymentId?: string) => {
    const updates: any = { payment_status: paymentStatus }
    if (razorpayPaymentId) {
      updates.razorpay_payment_id = razorpayPaymentId
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Error handling utility
export const handleSupabaseError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return 'No data found'
  }
  if (error?.code === '23505') {
    return 'This record already exists'
  }
  if (error?.code === '23503') {
    return 'Cannot delete this record as it is referenced by other records'
  }
  return error?.message || 'An unexpected error occurred'
} 