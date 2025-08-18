import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const hasUrl = !!supabaseUrl
    const hasAnonKey = !!supabaseAnonKey
    const hasServiceKey = !!supabaseServiceKey

    // Check if keys look like valid Supabase keys
    const urlIsValid = hasUrl && supabaseUrl!.includes('supabase.co')
    const anonKeyIsValid = hasAnonKey && supabaseAnonKey!.startsWith('eyJ')
    const serviceKeyIsValid = hasServiceKey && supabaseServiceKey!.startsWith('eyJ')

    return NextResponse.json({
      success: true,
      environment: {
        hasUrl,
        hasAnonKey,
        hasServiceKey,
        urlIsValid,
        anonKeyIsValid,
        serviceKeyIsValid,
        allValid: urlIsValid && anonKeyIsValid && serviceKeyIsValid
      },
      message: urlIsValid && anonKeyIsValid && serviceKeyIsValid 
        ? '✅ All Supabase environment variables are properly configured!'
        : '❌ Some Supabase environment variables are missing or invalid'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check Supabase configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 