'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

export default function CartPage() {
  const { items, totalItems, updateQuantity, removeFromCart, clearCart, isLoading } = useCart()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() // Add shipping, tax, etc. here if needed
  }

  return (
    <div className="bg-linear-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Breadcrumb removed per request */}

              {/* Page Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-2">
                  {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
                </p>
              </div>

              {items.length === 0 ? (
                /* Empty Cart */
                <div className="text-center py-16">
                  <div className="mb-8">
                    <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                  <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
                  <Link 
                    href="/products"
                    className="inline-block bg-[#2B5219] hover:bg-[#1a3110] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                /* Cart Items */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cart Items List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                          <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Clear Cart
                          </button>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                          <div key={item.id} className="p-6">
                            <div className="flex gap-4">
                              {/* Product Image */}
                              <div className="shrink-0">
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = '/products/bamboo-utensils.svg'
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                      {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {item.description}
                                    </p>
                                    <div className="flex items-center gap-2 mb-4">
                                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                        {item.tag}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={updatingItems.has(item.id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Price and Quantity */}
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-[#2B5219]">
                                      ₹{item.price}
                                    </span>
                                    {item.originalPrice && item.originalPrice > item.price && (
                                      <span className="text-sm text-gray-400 line-through">
                                        ₹{item.originalPrice}
                                      </span>
                                    )}
                                  </div>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                      disabled={updatingItems.has(item.id) || item.quantity <= 1}
                                      className="px-3 py-2 text-gray-600 hover:text-[#2B5219] disabled:opacity-50"
                                    >
                                      -
                                    </button>
                                    <span className="px-4 py-2 border-x border-gray-300">
                                      {updatingItems.has(item.id) ? (
                                        <div className="w-4 h-4 border-2 border-[#2B5219] border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        item.quantity
                                      )}
                                    </span>
                                    <button
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                      disabled={updatingItems.has(item.id) || item.quantity >= item.stock}
                                      className="px-3 py-2 text-gray-600 hover:text-[#2B5219] disabled:opacity-50"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                {/* Item Total */}
                                <div className="mt-4 text-right">
                                  <span className="text-lg font-semibold text-gray-900">
                                    Total: ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">₹{calculateSubtotal()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">Free</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-[#2B5219]">₹{calculateTotal()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Link 
                          href="/checkout"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
                        >
                          Proceed to Checkout
                        </Link>
                        <Link 
                          href="/products"
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold text-center block transition-colors"
                        >
                          Continue Shopping
                        </Link>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600 space-y-2">
                          <p>• Free shipping on orders over ₹500</p>
                          <p>• 30-day return policy</p>
                          <p>• Secure checkout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 