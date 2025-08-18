'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'

export default function CartTestPage() {
  const { user, session } = useAuth()
  const { addToCart, items, totalItems, isLoading, error } = useCart()
  const [testResult, setTestResult] = useState<any>(null)

  const testAuth = async () => {
    try {
      const response = await fetch('/api/auth/debug')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: 'Failed to test auth' })
    }
  }

  const testAddToCart = async () => {
    if (!user) {
      alert('Please login first')
      return
    }
    
    // Use a test product ID - you'll need to replace this with a real product ID
    try {
      await addToCart('test-product-id', 1)
    } catch (error) {
      console.error('Add to cart test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Cart Test Page</h1>
          
          {/* Auth Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">User</p>
                  <p className="text-lg font-bold text-blue-900">
                    {user ? `✅ ${user.email}` : '❌ Not Logged In'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Session</p>
                  <p className="text-lg font-bold text-blue-900">
                    {session ? '✅ Active' : '❌ None'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Status</h2>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-600">Total Items</p>
                  <p className="text-lg font-bold text-green-900">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Loading</p>
                  <p className="text-lg font-bold text-green-900">
                    {isLoading ? '⏳ Yes' : '✅ No'}
                  </p>
                </div>
              </div>
              {error && (
                <div className="mt-4 bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-red-800"><strong>Error:</strong> {error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={testAuth}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Test Authentication
              </Button>
              
              <Button
                onClick={testAddToCart}
                disabled={!user || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Test Add to Cart
              </Button>
              
              <Button
                onClick={() => window.location.href = '/products'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Go to Products
              </Button>
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Cart Items</h2>
            {items.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">No items in cart</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-2">How to Test</h3>
            <ol className="list-decimal list-inside text-yellow-800 space-y-1">
              <li>Make sure you're logged in (check Authentication Status above)</li>
              <li>Click "Test Authentication" to check server-side auth</li>
              <li>If auth is working, try "Test Add to Cart"</li>
              <li>Check the browser console for detailed logs</li>
              <li>If it redirects to login, there's a cookie/session issue</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}



































