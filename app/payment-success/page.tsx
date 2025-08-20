'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [countdown, setCountdown] = useState(1)
  const router = useRouter()

  useEffect(() => {
    // Get order details from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const paymentId = urlParams.get('payment_id')
    const orderId = urlParams.get('order_id')

    async function loadOrderAmount(razorpayOrderId: string) {
      try {
        const res = await fetch(`/api/payment/order-details?order_id=${encodeURIComponent(razorpayOrderId)}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          const amountDisplay = typeof data?.amountRupees === 'number' ? `₹${data.amountRupees}` : (data?.amountFormatted || '')
          setOrderDetails({
            paymentId: paymentId || '',
            orderId: razorpayOrderId,
            amount: amountDisplay || '—',
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN')
          })
          return
        }
      } catch {}
      // Fallback without amount
      setOrderDetails({
        paymentId: paymentId || '',
        orderId: razorpayOrderId,
        amount: '—',
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN')
      })
    }

    if (orderId) {
      void loadOrderAmount(orderId)
    }

    // Auto redirect countdown (fast)
    const t = setTimeout(() => router.replace('/orders'), 800)

    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="bg-linear-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-2xl w-full">
          {/* Success Content */}
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-green-100">
            {/* Success Animation */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono font-medium text-gray-900">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono font-medium text-gray-900">{orderDetails.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-green-600 text-lg">{orderDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{orderDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{orderDetails.time}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>You will receive an order confirmation email shortly</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>We'll send you tracking information once your order ships</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </div>

            {/* Auto Redirect Notice */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700">
                <span className="font-semibold">Auto-redirecting to home page in {countdown} seconds...</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200">
                  View Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 