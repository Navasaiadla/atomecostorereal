import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Try to get just one product with all fields
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error:', error)
      return NextResponse.json({
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      product: product,
      fields: product ? Object.keys(product) : []
    })
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

