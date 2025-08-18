import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET
  const publicRzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  return NextResponse.json({
    razorpay: {
      hasKeyId: !!razorpayKeyId,
      hasKeySecret: !!razorpayKeySecret,
      hasPublicKeyId: !!publicRzpKey,
      keyIdStartsWith: razorpayKeyId?.startsWith('rzp_') || false,
      publicKeyIdStartsWith: publicRzpKey?.startsWith('rzp_') || false,
    },
    supabaseUrl: {
      exists: !!supabaseUrl,
      length: supabaseUrl?.length || 0,
      value: supabaseUrl ? supabaseUrl.substring(0, 50) + '...' : null
    },
    supabaseAnonKey: {
      exists: !!supabaseAnonKey,
      length: supabaseAnonKey?.length || 0,
      value: supabaseAnonKey ? supabaseAnonKey.substring(0, 50) + '...' : null
    },
    serviceKey: {
      exists: !!serviceKey,
      length: serviceKey?.length || 0,
      value: serviceKey ? serviceKey.substring(0, 50) + '...' : null
    },
    allSet: !!(supabaseUrl && supabaseAnonKey && serviceKey),
    anonKeyComplete: supabaseAnonKey && supabaseAnonKey.length > 200
  })
} 