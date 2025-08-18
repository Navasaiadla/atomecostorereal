'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'

export default function TestCartPage() {
  const { items, totalItems, isLoading, error, addToCart, updateQuantity, removeFromCart, refreshCart } = useCart()
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const testCartAPI = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/test-cart')
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({ success: false, error: 'Failed to test cart API', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setTesting(false)
    }
  }

  const testAddToCart = async () => {
    try {
      // Try to add a test product (you'll need to replace with a real product ID)
      await addToCart('test-product-id', 1)
    } catch (error) {
      console.error('Add to cart test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Cart System Test</h1>
          
          {/* Cart Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Status</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Cart Items</p>
                  <p className="text-2xl font-bold text-blue-900">{items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Loading</p>
                  <p className="text-2xl font-bold text-blue-900">{isLoading ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Error</p>
                  <p className="text-2xl font-bold text-blue-900">{error ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-900 mb-4">Error</h2>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Items</h2>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                        >
                          -
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">API Test Results</h2>
              <div className={`p-4 rounded-lg border ${
                testResults.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Test Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={testCartAPI}
                disabled={testing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {testing ? 'Testing...' : 'Test Cart API'}
              </Button>
              
              <Button
                onClick={refreshCart}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                Refresh Cart
              </Button>
              
              <Button
                onClick={testAddToCart}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Test Add to Cart
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Test Cart</h2>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <ol className="list-decimal list-inside text-yellow-800 space-y-2">
                <li><strong>Login first</strong> - Cart functionality requires authentication</li>
                <li><strong>Test Cart API</strong> - Click the button to check if the cart system is working</li>
                <li><strong>Go to products</strong> - Visit <code className="bg-yellow-100 px-1 rounded">/products</code> to add items</li>
                <li><strong>Check cart</strong> - Visit <code className="bg-yellow-100 px-1 rounded">/cart</code> to see your items</li>
                <li><strong>Test real-time updates</strong> - Add/remove items and watch the cart count update</li>
              </ol>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-4">
            <a
              href="/products"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Products
            </a>
            <a
              href="/cart"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Cart
            </a>
            <a
              href="/login"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

