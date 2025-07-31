import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Check if Razorpay keys are configured before creating the instance
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  
  if (!keyId || !keySecret || keyId === 'rzp_test_your_key_id_here' || keySecret === 'your_key_secret_here') {
    throw new Error('Razorpay keys not configured properly')
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Creating Razorpay order...')
    console.log('Server Key ID:', process.env.RAZORPAY_KEY_ID)
    console.log('Server Key Secret exists:', !!process.env.RAZORPAY_KEY_SECRET)
    
    // Get Razorpay instance with proper error handling
    let razorpay
    try {
      razorpay = getRazorpayInstance()
    } catch (error) {
      console.error('Razorpay configuration error:', error)
      return NextResponse.json(
        { 
          error: 'Razorpay configuration missing. Please add your actual Razorpay keys to .env.local file. Check SETUP_RAZORPAY_NOW.md for instructions.' 
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { amount, currency = 'INR', receipt } = body

    console.log('Request body:', body)

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      )
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1,
    }

    console.log('Creating order with options:', options)
    const order = await razorpay.orders.create(options)
    console.log('Order created successfully:', order)

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 