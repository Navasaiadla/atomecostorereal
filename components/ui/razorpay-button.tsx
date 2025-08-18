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
  isCod?: boolean
  productId?: string | null
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
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
  isCod = false,
  productId = null,
  customerName,
  customerEmail,
  customerPhone,
  address,
  city,
  state,
  pincode,
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
      console.log('Starting payment process...', { isCod, amount, currency })
      
      // Always create the local order first
      const appOrderId = orderId || (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-xxxxxxxx-xxxx`)
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          receipt: appOrderId,
          app_order_id: appOrderId,
          product_id: productId || undefined,
          // Optional shipping/contact details for DB schemas that require them
          // send both full name and split first/last
          name: customerName,
          first_name: customerName?.split(' ')?.[0] || undefined,
          last_name: customerName?.split(' ')?.slice(1)?.join(' ') || undefined,
          address,
          city,
          state,
          pincode,
          email: customerEmail,
          phone: customerPhone,
          metadata: {
            product_id: productId || undefined,
            shipping: { name: customerName, first_name: customerName?.split(' ')?.[0] || undefined, last_name: customerName?.split(' ')?.slice(1)?.join(' ') || undefined, email: customerEmail, phone: customerPhone, address, city, state, pincode },
          },
        }),
      })

      console.log('Order response status:', orderResponse.status)
      if (!orderResponse.ok) {
        const text = await orderResponse.text()
        throw new Error(text || `Failed to create order. HTTP ${orderResponse.status}`)
      }
      const orderData = await orderResponse.json()
      console.log('Order data:', orderData)

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // COD branch: no Razorpay
      if (isCod) {
        try {
          const localOrderId = orderData?.order?.receipt || orderId || appOrderId
          const verifyResponse = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: localOrderId, cod: true })
          })
          const verifyData = await verifyResponse.json()
          if (verifyResponse.ok && verifyData?.success) {
            onSuccess?.({ cod: true, orderId: localOrderId, awb: verifyData?.awb })
            window.location.replace(`/payment-success?order_id=${encodeURIComponent(localOrderId)}&payment_id=COD`)
            return
          }
          const errMsg = verifyData?.error || 'COD placement failed'
          onFailure?.(errMsg)
          alert(`COD failed: ${errMsg}`)
          return
        } finally {
          setLoading(false)
        }
      }

      // Prepaid branch below
      // Check if Razorpay script is loaded with better error handling
      if (typeof window === 'undefined') {
        throw new Error('Window object not available. Please refresh the page.')
      }
      if (typeof window.Razorpay !== 'function') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (typeof window.Razorpay !== 'function') {
          throw new Error('Razorpay script not loaded. Please refresh the page and try again. If the issue persists, check your internet connection.')
        }
      }
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_your_key_id_here') {
        throw new Error('Razorpay API key not configured. Please add your Razorpay keys to .env.local')
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
          handler: async function (response: any) {
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
                  app_order_id: orderData?.order?.receipt,
                }),
              })

              const verifyData = await verifyResponse.json()
              console.log('Verification response:', verifyData)

              const verified = Boolean(
                verifyData?.success === true || verifyData?.status === 'verified' || verifyData?.verification?.status === 'verified'
              )

              if (verified) {
                // Best-effort log success
                try {
                  fetch('/api/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      order_id: orderData?.order?.id,
                      razorpay_payment_id: response?.razorpay_payment_id,
                      payment_status: 'captured',
                      payment_method: 'razorpay',
                      amount: orderData?.order?.amount,
                      raw_payload: { verified: true },
                    }),
                  }).catch(() => {})
                } catch {}
                console.log('✅ Payment verified successfully, calling onSuccess callback')
                onSuccess?.(response)
                // Redirect quickly to success page (will then move to orders)
                const orderId = response?.razorpay_order_id || orderData?.order?.id
                const paymentId = response?.razorpay_payment_id
                window.location.replace(`/payment-success?order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`)
              } else {
                const errMsg = verifyData?.error?.message || verifyData?.error || 'Verification failed'
                console.error('Payment verification failed:', errMsg)
                try {
                  fetch('/api/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      order_id: orderData?.order?.id,
                      razorpay_payment_id: response?.razorpay_payment_id,
                      payment_status: 'failed',
                      payment_method: 'razorpay',
                      raw_payload: { reason: 'verification_failed', verifyData },
                    }),
                  }).catch(() => {})
                } catch {}
                onFailure?.(errMsg)
                // Redirect to failure page
                window.location.replace(`/payment-failed?error_code=VERIFICATION_FAILED&error_description=${encodeURIComponent(errMsg)}&order_id=${response.razorpay_order_id}`)
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              try {
                fetch('/api/payments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    order_id: orderData?.order?.id,
                    payment_status: 'failed',
                    payment_method: 'razorpay',
                    raw_payload: { reason: 'verification_exception', error: String(error) },
                  }),
                }).catch(() => {})
              } catch {}
              onFailure?.(error)
              // Redirect to failure page
              const errorMessage = error instanceof Error ? error.message : 'Network error occurred'
              window.location.replace(`/payment-failed?error_code=NETWORK_ERROR&error_description=${encodeURIComponent(errorMessage)}&order_id=${response.razorpay_order_id || 'unknown'}`)
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false)
              console.log('Payment modal dismissed by user')
              // Redirect to failure page when modal is dismissed
              // Also log failed/cancelled event
              try {
                fetch('/api/payments', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    order_id: orderData.order.id,
                    payment_status: 'failed',
                    payment_method: 'razorpay',
                    raw_payload: { reason: 'modal_dismissed' },
                  }),
                }).catch(() => {})
              } catch {}
              window.location.replace(`/payment-failed?error_code=PAYMENT_CANCELLED&error_description=Payment was cancelled by user&order_id=${orderData.order.id}`)
            },
          },
          cancel: function (response: any) {
            setLoading(false)
            console.log('Payment cancelled by user:', response)
            onFailure?.({ message: 'Payment was cancelled by user' })
            // Redirect to failure page
            try {
              fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  order_id: orderData.order.id,
                  payment_status: 'failed',
                  payment_method: 'razorpay',
                  raw_payload: { reason: 'cancel_callback', response },
                }),
              }).catch(() => {})
            } catch {}
            window.location.replace(`/payment-failed?error_code=PAYMENT_CANCELLED&error_description=Payment was cancelled by user&order_id=${orderData.order.id}`)
          },
          theme: {
            color: '#2B5219',
          },
        }

        try {
          const razorpay = new window.Razorpay(options)
          razorpay.on('payment.failed', (response: any) => {
            setLoading(false)
            console.error('Razorpay reported failure:', response)
            onFailure?.(response?.error || { message: 'Payment failed' })
          })
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred creating payment/order'
      try {
        alert(`Payment could not start: ${errorMessage}`)
      } catch {}
      onFailure?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!loading && !disabled) void handlePayment()
      }}
      disabled={loading || disabled}
      className={className}
    >
      {loading ? 'Processing…' : children || (isCod ? 'Place COD Order' : 'Pay Now')}
    </Button>
  )
} 