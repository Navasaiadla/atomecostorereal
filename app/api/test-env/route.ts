import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  return NextResponse.json({
    hasKeyId: !!keyId,
    hasKeySecret: !!keySecret,
    hasPublicKeyId: !!publicKeyId,
    keyIdLength: keyId?.length || 0,
    keySecretLength: keySecret?.length || 0,
    publicKeyIdLength: publicKeyId?.length || 0,
    keyIdStartsWith: keyId?.startsWith('rzp_') || false,
    publicKeyIdStartsWith: publicKeyId?.startsWith('rzp_') || false,
    isDefaultKeyId: keyId === 'rzp_test_your_key_id_here',
    isDefaultKeySecret: keySecret === 'your_key_secret_here',
    isDefaultPublicKeyId: publicKeyId === 'rzp_test_your_key_id_here',
  })
} 