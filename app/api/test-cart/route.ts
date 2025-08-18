export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Test 1: Check if we can connect to Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        details: authError.message
      })
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user authenticated',
        message: 'Please login to test cart functionality'
      })
    }

    // Test 2: Check if cart table exists and is accessible
    const { data: cartTest, error: cartError } = await supabase
      .from('cart')
      .select('count')
      .limit(1)

    if (cartError) {
      return NextResponse.json({
        success: false,
        error: 'Cart table error',
        details: cartError.message,
        user: { id: user.id, email: user.email }
      })
    }

    // Test 3: Check if products table exists
    const { data: productsTest, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (productsError) {
      return NextResponse.json({
        success: false,
        error: 'Products table error',
        details: productsError.message,
        user: { id: user.id, email: user.email }
      })
    }

    // Test 4: Get user's cart items
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id as any)

    if (cartItemsError) {
      return NextResponse.json({
        success: false,
        error: 'Cart items fetch error',
        details: cartItemsError.message,
        user: { id: user.id, email: user.email }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart system is working properly',
      user: { id: user.id, email: user.email },
      cartItems: cartItems || [],
      cartItemsCount: cartItems?.length || 0,
      tests: {
        authentication: 'PASSED',
        cartTable: 'PASSED',
        productsTable: 'PASSED',
        cartItemsFetch: 'PASSED'
      }
    })

  } catch (error) {
    console.error('Cart test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

