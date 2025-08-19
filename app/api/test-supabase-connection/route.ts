import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    // Test 1: Check if we can connect to Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Test 2: Try to access the database (this will fail if tables don't exist, but connection should work)
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    // Test 3: Check if we can access categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('count')
      .limit(1)

    // Test 4: Check if we can access profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    const authWorking = !authError || authError.message === 'Auth session missing!'
    const dbAccessible = !dbError || dbError.code === 'PGRST116'
    const categoriesAccessible = !categoriesError || categoriesError.code === 'PGRST116'
    const profilesAccessible = !profilesError || profilesError.code === 'PGRST116'

    const allTablesAccessible = dbAccessible && categoriesAccessible && profilesAccessible

    return NextResponse.json({
      success: true,
      tests: {
        authentication: {
          success: authWorking,
          error: authError?.message || null,
          user: user ? { id: user.id, email: user.email } : null,
          note: authError?.message === 'Auth session missing!' ? 'Expected - no user logged in' : null
        },
        database: {
          success: dbAccessible,
          error: dbError?.message || null,
          errorCode: dbError?.code || null,
          products: products || [],
          note: dbError?.code === 'PGRST116' ? 'Table does not exist (expected if not created yet)' : null
        },
        categories: {
          success: categoriesAccessible,
          error: categoriesError?.message || null,
          errorCode: categoriesError?.code || null,
          categories: categories || [],
          note: categoriesError?.code === 'PGRST116' ? 'Table does not exist (expected if not created yet)' : null
        },
        profiles: {
          success: profilesAccessible,
          error: profilesError?.message || null,
          errorCode: profilesError?.code || null,
          profiles: profiles || [],
          note: profilesError?.code === 'PGRST116' ? 'Table does not exist (expected if not created yet)' : null
        }
      },
      summary: {
        authWorking,
        dbAccessible,
        allTablesAccessible,
        readyForTables: authWorking && allTablesAccessible,
        hasData: products && products.length > 0
      },
      message: authWorking && allTablesAccessible
        ? '✅ Supabase connection is working perfectly! Your database is ready to use.'
        : authWorking && !allTablesAccessible
        ? '✅ Supabase connection works! You need to create your database tables.'
        : '❌ There are issues with the Supabase connection.'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test Supabase connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 