'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'

export default function DebugAuthCartPage() {
  const { user, session, loading: authLoading, isSupabaseAvailable } = useAuth()
  const { items, totalItems, isLoading: cartLoading, error: cartError, addToCart, refreshCart } = useCart()
  const [authCheck, setAuthCheck] = useState<any>(null)
  const [cartTest, setCartTest] = useState<any>(null)
  const [sessionTest, setSessionTest] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  const checkAuthStatus = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/auth/check')
      const data = await response.json()
      setAuthCheck(data)
    } catch (error) {
      setAuthCheck({ error: 'Failed to check auth', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setTesting(false)
    }
  }

  const testCartAPI = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/test-cart')
      const data = await response.json()
      setCartTest(data)
    } catch (error) {
      setCartTest({ error: 'Failed to test cart', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setTesting(false)
    }
  }

  const testSession = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/auth/test-session')
      const data = await response.json()
      setSessionTest(data)
    } catch (error) {
      setSessionTest({ error: 'Failed to test session', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setTesting(false)
    }
  }

  const loadProducts = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/products/list')
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setTesting(false)
    }
  }

  const testAddToCart = async (productId?: string) => {
    if (!user) {
      alert('Please login first')
      return
    }
    
    const productToAdd = productId || (products[0]?.id)
    
    if (!productToAdd) {
      alert('No products available to test with')
      return
    }
    
    try {
      await addToCart(productToAdd, 1)
    } catch (error) {
      console.error('Add to cart test failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Auth & Cart Debug</h1>
          
          {/* Auth Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-600">User</p>
                  <p className="text-lg font-bold text-blue-900">{user ? 'Logged In' : 'Not Logged In'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Session</p>
                  <p className="text-lg font-bold text-blue-900">{session ? 'Active' : 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Supabase</p>
                  <p className="text-lg font-bold text-blue-900">{isSupabaseAvailable ? 'Available' : 'Error'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Loading</p>
                  <p className="text-lg font-bold text-blue-900">{authLoading ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {user && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-green-800"><strong>User ID:</strong> {user.id}</p>
                  <p className="text-green-800"><strong>Email:</strong> {user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Status</h2>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-green-600">Total Items</p>
                  <p className="text-lg font-bold text-green-900">{totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Cart Items</p>
                  <p className="text-lg font-bold text-green-900">{items.length}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Loading</p>
                  <p className="text-lg font-bold text-green-900">{cartLoading ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Error</p>
                  <p className="text-lg font-bold text-green-900">{cartError ? 'Yes' : 'No'}</p>
                </div>
              </div>
              
              {cartError && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-red-800"><strong>Cart Error:</strong> {cartError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Auth Check Results */}
          {authCheck && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Auth API Check</h2>
              <div className={`p-4 rounded-lg border ${
                authCheck.authenticated ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(authCheck, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Cart Test Results */}
          {cartTest && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart API Test</h2>
              <div className={`p-4 rounded-lg border ${
                cartTest.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(cartTest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Session Test Results */}
          {sessionTest && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Test</h2>
              <div className={`p-4 rounded-lg border ${
                sessionTest.authenticated ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(sessionTest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Test Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={checkAuthStatus}
                disabled={testing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {testing ? 'Testing...' : 'Check Auth Status'}
              </Button>
              
              <Button
                onClick={testCartAPI}
                disabled={testing}
                className="bg-green-600 hover:bg-green-700"
              >
                {testing ? 'Testing...' : 'Test Cart API'}
              </Button>
              
              <Button
                onClick={testSession}
                disabled={testing}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {testing ? 'Testing...' : 'Test Session'}
              </Button>
              
              <Button
                onClick={refreshCart}
                disabled={cartLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Refresh Cart
              </Button>
              
              <Button
                onClick={loadProducts}
                disabled={testing}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {testing ? 'Loading...' : 'Load Products'}
              </Button>
              
              <Button
                onClick={() => testAddToCart()}
                disabled={cartLoading || !user || products.length === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Test Add to Cart
              </Button>
            </div>
          </div>

          {/* Available Products */}
          {products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Products</h2>
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{product.title}</p>
                        <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                        <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => testAddToCart(product.id)}
                        disabled={cartLoading || !user}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Troubleshooting Steps</h2>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <ol className="list-decimal list-inside text-yellow-800 space-y-2">
                <li><strong>Check Auth Status</strong> - Verify you're properly logged in</li>
                <li><strong>Test Cart API</strong> - Check if cart system is working</li>
                <li><strong>Check Database</strong> - Ensure cart table exists in Supabase</li>
                <li><strong>Check Environment</strong> - Verify Supabase credentials are correct</li>
                <li><strong>Check Console</strong> - Look for any JavaScript errors</li>
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
            <a
              href="/test-cart"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Cart Test Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
