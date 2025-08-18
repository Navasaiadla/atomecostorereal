import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Test basic connection
    console.log('🔍 Testing database connection...')
    
    // Check if products table exists and has data
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Products table error:', productsError)
      return NextResponse.json({
        error: 'Products table error',
        details: productsError
      }, { status: 500 })
    }
    
    // Check if categories table exists and has data
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError)
      return NextResponse.json({
        error: 'Categories table error',
        details: categoriesError
      }, { status: 500 })
    }
    
    console.log('✅ Database connection successful')
    console.log(`📦 Found ${products?.length || 0} products`)
    console.log(`📂 Found ${categories?.length || 0} categories`)
    
    // Show the structure of the first product and category
    const productStructure = products?.[0] ? Object.keys(products[0]) : []
    const categoryStructure = categories?.[0] ? Object.keys(categories[0]) : []
    
    // Show the first product in detail
    const firstProduct = products?.[0] || null
    
    return NextResponse.json({
      success: true,
      products: products || [],
      categories: categories || [],
      productsCount: products?.length || 0,
      categoriesCount: categories?.length || 0,
      productStructure,
      categoryStructure,
      firstProduct,
      firstCategory: categories?.[0] || null
    })
    
  } catch (error) {
    console.error('❌ Database test error:', error)
    return NextResponse.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
