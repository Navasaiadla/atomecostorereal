'use client'

import { useEffect, useState } from 'react'
import { Button } from './button'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayButtonProps {
  amount: number
  currency?: string
  orderId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  onSuccess?: (response: any) => void
  onFailure?: (error: any) => void
  className?: string
  children?: React.ReactNode
}

export function RazorpayButton({
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
  className,
  children
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setLoading(true)
    try {
      console.log('Starting payment process...')
      console.log('Amount:', amount)
      console.log('Currency:', currency)
      
      // Check if Razorpay key is configured
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_your_key_id_here') {
        throw new Error('Razorpay API key not configured. Please add your Razorpay keys to .env.local file.')
      }

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: orderId || `order_${Date.now()}`,
        }),
      })

      console.log('Order response status:', orderResponse.status)
      const orderData = await orderResponse.json()
      console.log('Order data:', orderData)

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'AtomEcoStore',
        description: 'Eco-friendly products purchase',
        order_id: orderData.order.id,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
                 handler: async function (response: any) {
           try {
             // Verify payment
             const verifyResponse = await fetch('/api/payment/verify', {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature,
               }),
             })

             const verifyData = await verifyResponse.json()

             if (verifyData.success) {
               onSuccess?.(response)
               // Redirect to success page with payment details
               window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`
             } else {
               onFailure?.(verifyData.error)
               // Redirect to failure page
               window.location.href = `/payment-failed?error_code=VERIFICATION_FAILED&error_description=${encodeURIComponent(verifyData.error)}&order_id=${response.razorpay_order_id}`
             }
                    } catch (error) {
           onFailure?.(error)
           // Redirect to failure page
           const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
           window.location.href = `/payment-failed?error_code=NETWORK_ERROR&error_description=${encodeURIComponent(errorMessage)}&order_id=${response.razorpay_order_id || 'unknown'}`
         }
         },
                 modal: {
           ondismiss: function () {
             setLoading(false)
             // Redirect to failure page when modal is dismissed
             window.location.href = `/payment-failed?error_code=PAYMENT_CANCELLED&error_description=Payment was cancelled by user&order_id=${orderData.order.id}`
           },
         },
        theme: {
          color: '#2B5219',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      onFailure?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : children || 'Pay Now'}
    </Button>
  )
} 