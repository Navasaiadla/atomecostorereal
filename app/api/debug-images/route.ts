import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    console.log('🔍 Debugging product images...')
    
    // Get all product images
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
    
    if (imagesError) {
      console.error('❌ Product images error:', imagesError)
      return NextResponse.json({
        error: 'Failed to fetch product images',
        details: imagesError
      }, { status: 500 })
    }
    
    // Get all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
    
    if (productsError) {
      console.error('❌ Products error:', productsError)
      return NextResponse.json({
        error: 'Failed to fetch products',
        details: productsError
      }, { status: 500 })
    }
    
    console.log(`📦 Found ${products?.length || 0} products`)
    console.log(`🖼️ Found ${images?.length || 0} product images`)
    
    // Show the structure of the first image
    const imageStructure = images?.[0] ? Object.keys(images[0]) : []
    
    return NextResponse.json({
      success: true,
      products: products || [],
      images: images || [],
      productsCount: products?.length || 0,
      imagesCount: images?.length || 0,
      imageStructure,
      sampleImage: images?.[0] || null,
      sampleProduct: products?.[0] || null
    })
    
  } catch (error) {
    console.error('❌ Debug images error:', error)
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
