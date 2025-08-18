export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // First, let's try to get a list of all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public' as any)

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
    }

    // Try to get the structure of the products table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public' as any)
      .eq('table_name', 'products' as any)

    if (columnsError) {
      console.error('Error fetching columns:', columnsError)
    }

    // Try a simple query to see what happens
    let simpleQueryResult = null
    let simpleQueryError: unknown = null
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)
      
      simpleQueryResult = data
      simpleQueryError = error
    } catch (e) {
      simpleQueryError = e
    }

    return NextResponse.json({
      message: 'Database debug information',
      tables: tables || [],
      productsColumns: columns || [],
      simpleQueryResult,
      simpleQueryError: simpleQueryError && simpleQueryError instanceof Error ? simpleQueryError.message : null,
      hasProductsTable: !!(columns && columns.length > 0)
    })
  } catch (error) {
    console.error('Debug API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

