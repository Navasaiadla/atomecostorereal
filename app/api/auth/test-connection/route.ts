import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const envCheck = {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    }

    // Test Supabase connection
    let connectionTest: { success: boolean; error: string | null } = { success: false, error: null }
    try {
      const supabase = createAdminClient()
      
      // Test a simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) {
        connectionTest = { success: false, error: error.message }
      } else {
        connectionTest = { success: true, error: null }
      }
    } catch (error) {
      connectionTest = { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      connection: connectionTest,
      status: 'test_completed'
    })
  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to test connection',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

