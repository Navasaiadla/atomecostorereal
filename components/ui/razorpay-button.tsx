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
  disabled?: boolean
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
  children,
  disabled = false
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Check if Razorpay is available on mount and retry if needed
  useEffect(() => {
    const checkRazorpayAvailability = () => {
      if (typeof window !== 'undefined' && typeof window.Razorpay === 'function') {
        console.log('✅ Razorpay constructor is available')
        setScriptLoaded(true)
        return true
      }
      return false
    }

    // Check immediately
    if (checkRazorpayAvailability()) {
      return
    }

    console.log('🔄 Waiting for Razorpay script to load...')

    // If not available, set up polling with exponential backoff
    const maxRetries = 20 // Increased for production
    const interval = setInterval(() => {
      if (checkRazorpayAvailability()) {
        clearInterval(interval)
      } else {
        setRetryCount(prev => {
          const newCount = prev + 1
          if (newCount >= maxRetries) {
            clearInterval(interval)
            console.error('❌ Razorpay script failed to load after maximum retries')
          } else {
            console.log(`⏳ Retry ${newCount}/${maxRetries}: Waiting for Razorpay...`)
          }
          return newCount
        })
      }
    }, 200) // Increased interval for production

    // Cleanup after 15 seconds (increased for production)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      console.log('⏰ Razorpay script loading timeout')
    }, 15000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const handlePayment = async () => {
    if (disabled) {
      return
    }
    
    setLoading(true)
    try {
      console.log('Starting payment process...')
      console.log('Amount:', amount)
      console.log('Currency:', currency)
      console.log('Client Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
      console.log('Script loaded:', scriptLoaded)
      console.log('Window Razorpay available:', typeof window.Razorpay)
      console.log('Retry count:', retryCount)
      
      // Check if Razorpay script is loaded with better error handling
      if (typeof window === 'undefined') {
        throw new Error('Window object not available. Please refresh the page.')
      }
      
      if (typeof window.Razorpay !== 'function') {
        // Try to wait a bit more for the script to load
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (typeof window.Razorpay !== 'function') {
          throw new Error('Razorpay script not loaded. Please refresh the page and try again. If the issue persists, check your internet connection.')
        }
      }
      
      // Check if Razorpay key is configured
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_your_key_id_here') {
        throw new Error('Razorpay API key not configured. Please add your Razorpay keys to .env.local file. See RAZORPAY_SETUP.md for instructions.')
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

      // Initialize Razorpay with enhanced safety check
      if (typeof window !== 'undefined' && window.Razorpay && typeof window.Razorpay === 'function') {
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
          handler: {
            payment_success: async function (response: any) {
              try {
                console.log('Payment success response:', response)
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
                console.log('Verification response:', verifyData)

                if (verifyData.success) {
                  onSuccess?.(response)
                  // Redirect to success page with payment details
                  window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`
                } else {
                  console.error('Payment verification failed:', verifyData.error)
                  onFailure?.(verifyData.error)
                  // Redirect to failure page
                  window.location.href = `/payment-failed?error_code=VERIFICATION_FAILED&error_description=${encodeURIComponent(verifyData.error)}&order_id=${response.razorpay_order_id}`
                }
              } catch (error) {
                console.error('Payment verification error:', error)
                onFailure?.(error)
                // Redirect to failure page
                const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
                window.location.href = `/payment-failed?error_code=NETWORK_ERROR&error_description=${encodeURIComponent(errorMessage)}&order_id=${response.razorpay_order_id || 'unknown'}`
              }
            },
            payment_failed: function (response: any) {
              console.error('Payment failed response:', response)
              console.error('Payment failed error details:', response.error)
              onFailure?.(response.error)
              // Redirect to failure page
              window.location.href = `/payment-failed?error_code=PAYMENT_FAILED&error_description=${encodeURIComponent(response.error?.description || 'Payment failed')}&order_id=${response.razorpay_order_id || orderData.order.id}`
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false)
              console.log('Payment modal dismissed by user')
              // Redirect to failure page when modal is dismissed
              window.location.href = `/payment-failed?error_code=PAYMENT_CANCELLED&error_description=Payment was cancelled by user&order_id=${orderData.order.id}`
            },
          },
          theme: {
            color: '#2B5219',
          },
        }

        try {
          const razorpay = new window.Razorpay(options)
          razorpay.open()
        } catch (constructorError) {
          console.error('Razorpay constructor error:', constructorError)
          throw new Error('Failed to initialize Razorpay. Please refresh the page and try again.')
        }
      } else {
        throw new Error('Razorpay is not loaded yet. Please refresh the page and try again.')
      }
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
      disabled={loading || disabled}
      className={className}
    >
      {loading ? 'Processing...' : children || 'Pay Now'}
    </Button>
  )
} 