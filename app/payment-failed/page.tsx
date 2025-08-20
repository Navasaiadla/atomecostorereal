'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PaymentFailedPage() {
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [countdown, setCountdown] = useState(15)
  const router = useRouter()

  useEffect(() => {
    // Get error details from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const errorCode = urlParams.get('error_code')
    const errorDescription = urlParams.get('error_description')
    const orderId = urlParams.get('order_id')
    
    setErrorDetails({
      errorCode: errorCode || 'PAYMENT_FAILED',
      errorDescription: errorDescription || 'Payment was not completed successfully',
      orderId: orderId || 'Unknown',
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN')
    })

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="bg-linear-to-br from-red-50 to-pink-50">
      <div className="flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-2xl w-full">
          {/* Failure Content */}
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-red-100">
            {/* Failure Animation */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Failed! 😔
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              We're sorry, but your payment could not be processed. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details */}
            {errorDetails && (
              <div className="bg-linear-to-r from-red-50 to-pink-50 rounded-xl p-6 mb-8 border border-red-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Error Code:</span>
                    <span className="font-mono font-medium text-red-600">{errorDetails.errorCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono font-medium text-gray-900">{errorDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{errorDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{errorDetails.time}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {errorDetails.errorDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What You Can Do</h3>
              <div className="text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Check your payment method and try again</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Ensure you have sufficient funds in your account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Contact our support team if the issue persists</span>
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
              <Link href="/checkout">
                <Button className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-8 py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Try Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200">
                  Go Home
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-200">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 