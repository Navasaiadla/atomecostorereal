'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface EnvStatus {
  clientKeyId?: string
  clientKeyIdExists: boolean
  clientKeyIdValid: boolean
  clientKeyIdLength: number
  server?: any
}

interface OrderTest {
  status: number | string
  success: boolean
  data?: any
  error?: string
}

export default function RazorpayDebugPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [orderTest, setOrderTest] = useState<OrderTest | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check environment variables on client side
    const clientKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    setEnvStatus({
      clientKeyId,
      clientKeyIdExists: !!clientKeyId,
      clientKeyIdValid: clientKeyId && clientKeyId.startsWith('rzp_') && clientKeyId !== 'rzp_test_your_key_id_here',
      clientKeyIdLength: clientKeyId?.length || 0
    })
  }, [])

  const testOrderCreation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          currency: 'INR',
          receipt: `test_${Date.now()}`,
        }),
      })

      const data = await response.json()
      setOrderTest({
        status: response.status,
        success: response.ok,
        data
      })
    } catch (error) {
      setOrderTest({
        status: 'ERROR',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const testServerEnv = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-env')
      const data = await response.json()
      setEnvStatus((prev: EnvStatus | null) => prev ? { ...prev, server: data } : { 
        clientKeyId: '',
        clientKeyIdExists: false,
        clientKeyIdValid: false,
        clientKeyIdLength: 0,
        server: data 
      })
    } catch (error) {
      console.error('Error testing server env:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Razorpay Debug Page</h1>
      
      {/* Environment Variables Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
        
        {envStatus && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Client-Side (Browser)</h3>
                <div className="space-y-2 text-sm">
                  <div>Key ID exists: <span className={envStatus.clientKeyIdExists ? 'text-green-600' : 'text-red-600'}>{envStatus.clientKeyIdExists ? '✅' : '❌'}</span></div>
                  <div>Key ID valid: <span className={envStatus.clientKeyIdValid ? 'text-green-600' : 'text-red-600'}>{envStatus.clientKeyIdValid ? '✅' : '❌'}</span></div>
                  <div>Key ID length: {envStatus.clientKeyIdLength}</div>
                  <div>Key ID: <code className="bg-gray-100 px-2 py-1 rounded">{envStatus.clientKeyId || 'Not set'}</code></div>
                </div>
              </div>
              
              {envStatus.server && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Server-Side (API)</h3>
                  <div className="space-y-2 text-sm">
                    <div>Key ID exists: <span className={envStatus.server.hasKeyId ? 'text-green-600' : 'text-red-600'}>{envStatus.server.hasKeyId ? '✅' : '❌'}</span></div>
                    <div>Key Secret exists: <span className={envStatus.server.hasKeySecret ? 'text-green-600' : 'text-red-600'}>{envStatus.server.hasKeySecret ? '✅' : '❌'}</span></div>
                    <div>Public Key ID exists: <span className={envStatus.server.hasPublicKeyId ? 'text-green-600' : 'text-red-600'}>{envStatus.server.hasPublicKeyId ? '✅' : '❌'}</span></div>
                    <div>Key ID valid: <span className={envStatus.server.keyIdStartsWith ? 'text-green-600' : 'text-red-600'}>{envStatus.server.keyIdStartsWith ? '✅' : '❌'}</span></div>
                    <div>Public Key ID valid: <span className={envStatus.server.publicKeyIdStartsWith ? 'text-green-600' : 'text-red-600'}>{envStatus.server.publicKeyIdStartsWith ? '✅' : '❌'}</span></div>
                  </div>
                </div>
              )}
            </div>
            
            <Button onClick={testServerEnv} disabled={loading} className="mt-4">
              {loading ? 'Testing...' : 'Test Server Environment'}
            </Button>
          </div>
        )}
      </div>

      {/* Order Creation Test */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Creation Test</h2>
        
        <Button onClick={testOrderCreation} disabled={loading} className="mb-4">
          {loading ? 'Creating Order...' : 'Test Order Creation (₹1)'}
        </Button>
        
        {orderTest && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Test Result:</h3>
            <div className="space-y-2 text-sm">
              <div>Status: <span className={orderTest.success ? 'text-green-600' : 'text-red-600'}>{orderTest.status}</span></div>
              <div>Success: <span className={orderTest.success ? 'text-green-600' : 'text-red-600'}>{orderTest.success ? '✅' : '❌'}</span></div>
              <div>Response:</div>
              <pre className="bg-white p-3 rounded border text-xs overflow-auto">
                {JSON.stringify(orderTest.data || orderTest.error, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Debugging Instructions</h2>
        <div className="space-y-2 text-blue-700">
          <p>1. Check that all environment variables are properly set in Vercel dashboard</p>
          <p>2. Ensure <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> starts with <code>rzp_</code></p>
          <p>3. Verify <code>RAZORPAY_KEY_SECRET</code> is set on server-side only</p>
          <p>4. Test order creation to ensure API keys are working</p>
          <p>5. Check browser console for detailed error logs</p>
        </div>
      </div>
    </div>
  )
} 