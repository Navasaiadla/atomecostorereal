'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { createClient } from '@/lib/supabase'

export default function TestCartFlow() {
  const { items, totalItems, addToCart, updateQuantity, removeFromCart, error, successMessage, clearError, clearSuccess } = useCart()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const testAddToCart = async () => {
    // Use a test product ID - you'll need to replace this with a real product ID from your database
    const testProductId = '16aa5cdc-c3de-4275-bac1-a0c20dbac904' // Replace with actual product ID
    await addToCart(testProductId, 1)
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cart Flow Test</h1>
      
      {/* User Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">User Status</h2>
        {user ? (
          <div>
            <p><strong>Logged in:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        ) : (
          <div>
            <p><strong>Status:</strong> Not logged in</p>
            <p className="text-red-600">You need to log in to test cart functionality</p>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800">{successMessage}</span>
            </div>
            <button onClick={clearSuccess} className="text-green-400 hover:text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Test Actions */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-y-4">
          <Button 
            onClick={testAddToCart}
            disabled={!user}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Test Product to Cart
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>• This will add a test product to your cart</p>
            <p>• You need to be logged in for this to work</p>
            <p>• Check the cart items below to see the result</p>
          </div>
        </div>
      </div>

      {/* Cart Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cart Status</h2>
        
        <div className="mb-4">
          <p><strong>Total Items:</strong> {totalItems}</p>
          <p><strong>Cart Items Count:</strong> {items.length}</p>
        </div>

        {items.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cart Items:</h3>
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">Price: ₹{item.price}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Stock: {item.stock}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      size="sm"
                      variant="outline"
                    >
                      -
                    </Button>
                    <span className="px-3 py-1 border border-gray-300 rounded">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      size="sm"
                      variant="outline"
                    >
                      +
                    </Button>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      size="sm"
                      variant="destructive"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p>Your cart is empty</p>
            <p className="text-sm">Add some products to test the cart functionality</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in (check User Status above)</li>
          <li>Click "Add Test Product to Cart" to add an item</li>
          <li>Use the +/- buttons to update quantities</li>
          <li>Use the "Remove" button to remove items</li>
          <li>Check that success/error messages appear</li>
          <li>Verify that the cart total updates correctly</li>
        </ol>
      </div>
    </div>
  )
}
