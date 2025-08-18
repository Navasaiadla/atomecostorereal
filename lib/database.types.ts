export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Users table (extends Supabase auth.users) - Updated to match actual schema
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          full_name: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
          full_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          full_name?: string | null
        }
      }
      // Products table
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          price: number
          sale_price: number | null
          images: string[]
          category_id: string | null
          seller_id: string
          stock: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          sale_price?: number | null
          images?: string[]
          category_id?: string | null
          seller_id: string
          stock: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          sale_price?: number | null
          images?: string[]
          category_id?: string | null
          seller_id?: string
          stock?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Categories table - Updated to match actual database structure
      categories: {
        Row: {
          id: string
          Category: string // Actual field name in database
          created_at: string
        }
        Insert: {
          id?: string
          Category: string
          created_at?: string
        }
        Update: {
          id?: string
          Category?: string
          created_at?: string
        }
      }
      // Orders table
      orders: {
        Row: {
          id: string
          customer_id: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: Json
          billing_address: Json
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: Json
          billing_address: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: Json
          billing_address?: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Order items table
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      // Payments table (as per user's schema)
      payments: {
        Row: {
          id: string
          transaction_id: string | null
          payment_status: string
          payment_method: string
          created_at: string
          raw_payload: string | null
        }
        Insert: {
          id?: string
          transaction_id?: string | null
          payment_status: string
          payment_method: string
          created_at?: string
          raw_payload?: string | null
        }
        Update: {
          id?: string
          transaction_id?: string | null
          payment_status?: string
          payment_method?: string
          created_at?: string
          raw_payload?: string | null
        }
      }
      // Cart items table
      cart_items: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      // Reviews table
      reviews: {
        Row: {
          id: string
          product_id: string
          customer_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified_purchase: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          customer_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          customer_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified_purchase?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific type exports
export type Profile = Tables<'profiles'>
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type CartItem = Tables<'cart_items'>
export type Review = Tables<'reviews'>

// Helper types for frontend
export interface CategoryWithName {
  id: string
  name: string
  description: string
  image: string
} 