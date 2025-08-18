import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

// Get cart items for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get the current session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error in GET:', sessionError)
      return NextResponse.json({
        items: [],
        totalItems: 0,
        error: 'Session error'
      })
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error in GET:', authError)
      return NextResponse.json({
        items: [],
        totalItems: 0,
        error: 'Auth error'
      })
    }

    if (!user) {
      console.log('No user found in GET despite having session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('User authenticated in GET:', { id: user.id, email: user.email })

    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart')
      .select(`
        id,
        user_id,
        product_id,
        quantity,
        created_at,
        updated_at,
        products (
          id,
          title,
          description,
          price,
          stock,
          is_active
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching cart items:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }

    // Transform the data to match frontend expectations
    const transformedItems = cartItems?.map((item: any) => ({
      id: item.id,
      product_id: item.products.id,
      name: item.products.title,
      description: item.products.description,
      price: item.products.price,
      originalPrice: null,
      quantity: item.quantity,
      // Prefer first image if available via separate images table or string array column
      image: (item.products as any).images?.[0] || '/bamboo-utensils.svg',
      tag: 'Eco-Friendly',
      stock_quantity: item.products.stock,
      is_active: item.products.is_active
    })) || []

    return NextResponse.json({
      items: transformedItems,
      totalItems: transformedItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { product_id, quantity = 1 } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('No user found - authentication failed')
      return NextResponse.json(
        { error: 'Please login to add items to cart' },
        { status: 401 }
      )
    }

    console.log('User authenticated successfully:', { id: user.id, email: user.email })

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock, is_active')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.is_active) {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity
      
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }

      const { data: updatedItem, error: updateError } = await supabase
        .from('cart')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating cart item:', updateError)
        return NextResponse.json(
          { error: 'Failed to update cart item' },
          { status: 500 }
        )
      }

      // Join with product to return enriched item (faster client update)
      const { data: joined, error: joinErr } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          products (
            id,
            title,
            description,
            price,
            images,
            stock,
            is_active
          )
        `)
        .eq('id', updatedItem.id)
        .single()

      if (joinErr || !joined) {
        return NextResponse.json({ message: 'Cart item updated successfully', item: updatedItem })
      }

      const transformed = {
        id: joined.id,
        product_id: (joined as any).products.id,
        name: (joined as any).products.title,
        description: (joined as any).products.description,
        price: (joined as any).products.price,
        originalPrice: null,
        quantity: joined.quantity,
        image: ((joined as any).products.images?.[0]) || '/bamboo-utensils.svg',
        tag: 'Eco-Friendly',
        stock_quantity: (joined as any).products.stock,
        is_active: (joined as any).products.is_active,
      }

      return NextResponse.json({ 
        message: 'Cart item updated successfully',
        item: transformed
      })
    } else {
      // Add new item to cart
      const { data: newItem, error: insertError } = await supabase
        .from('cart')
        .insert({
          user_id: user.id,
          product_id,
          quantity
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error adding cart item:', insertError)
        return NextResponse.json(
          { error: 'Failed to add item to cart' },
          { status: 500 }
        )
      }

      // Join with product to return enriched item
      const { data: joined, error: joinErr } = await supabase
        .from('cart')
        .select(`
          id,
          quantity,
          products (
            id,
            title,
            description,
            price,
            images,
            stock,
            is_active
          )
        `)
        .eq('id', newItem.id)
        .single()

      if (joinErr || !joined) {
        return NextResponse.json({ message: 'Item added to cart successfully', item: newItem })
      }

      const transformed = {
        id: joined.id,
        product_id: (joined as any).products.id,
        name: (joined as any).products.title,
        description: (joined as any).products.description,
        price: (joined as any).products.price,
        originalPrice: null,
        quantity: joined.quantity,
        image: ((joined as any).products.images?.[0]) || '/bamboo-utensils.svg',
        tag: 'Eco-Friendly',
        stock_quantity: (joined as any).products.stock,
        is_active: (joined as any).products.is_active,
      }

      return NextResponse.json({ 
        message: 'Item added to cart successfully',
        item: transformed
      })
    }
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { cart_item_id, quantity } = body

    if (!cart_item_id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      )
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get cart item with product details to check stock
    const { data: cartItem, error: fetchError } = await supabase
      .from('cart')
      .select(`
        id,
        quantity,
        products (
          id,
          stock
        )
      `)
      .eq('id', cart_item_id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity > (cartItem.products as any).stock) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Update the cart item
    const { data: updatedItem, error: updateError } = await supabase
      .from('cart')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', cart_item_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating cart item:', updateError)
      return NextResponse.json(
        { error: 'Failed to update cart item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Cart item updated successfully',
      item: updatedItem
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const cart_item_id = searchParams.get('cart_item_id')

    if (!cart_item_id) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      )
    }

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the cart item
    const { error: deleteError } = await supabase
      .from('cart')
      .delete()
      .eq('id', cart_item_id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting cart item:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove item from cart' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Item removed from cart successfully'
    })
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Note: clear cart handler is implemented in app/api/cart/clear/route.ts
