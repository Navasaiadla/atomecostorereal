'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

export default function CartPage() {
  // Sample cart data - in a real app, this would come from state management
  const cartItems = [
    {
      id: 'eco-friendly-bag',
      name: 'Eco-Friendly Shopping Bag',
      price: 199,
      originalPrice: 299,
      quantity: 2,
      image: '/eco frendly bag.webp',
      tag: 'Reusable'
    },
    {
      id: 'cotton-tshirt',
      name: 'Organic Cotton T-Shirt',
      price: 449,
      originalPrice: 599,
      quantity: 1,
      image: '/cotton tshirt.webp',
      tag: 'Sustainable'
    },
    {
      id: 'bamboo-cup',
      name: 'Bamboo Travel Cup',
      price: 249,
      originalPrice: 349,
      quantity: 1,
      image: '/bamboo cup.webp',
      tag: 'Eco-Friendly'
    }
  ]

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 500 ? 0 : 50
  const tax = Math.round(subtotal * 0.05) // 5% tax
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-[#2B5219]">Home</Link></li>
                <li>/</li>
                <li className="text-gray-900">Cart</li>
              </ol>
            </nav>

            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="font-medium">{cartItems.length} items</span>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some eco-friendly products to get started!</p>
                <Link href="/products" className="inline-block bg-[#2B5219] hover:bg-[#1a3110] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="w-full h-full object-contain"
                            />
                            <span className="absolute top-2 left-2 bg-[#2B5219] text-white text-xs px-2 py-1 rounded-full font-semibold">
                              {item.tag}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[#2B5219] font-bold text-lg">₹{item.price}</span>
                                {item.originalPrice > item.price && (
                                  <span className="text-gray-500 text-sm line-through">₹{item.originalPrice}</span>
                                )}
                              </div>
                              {item.originalPrice > item.price && (
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                </span>
                              )}
                            </div>
                                                         <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                 <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                                   <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">
                                     -
                                   </button>
                                   <span className="px-4 py-2 border-x border-gray-200 font-bold text-lg bg-gray-50 min-w-[3rem] text-center">
                                     {item.quantity}
                                   </span>
                                   <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg">
                                     +
                                   </button>
                                 </div>
                               </div>
                               <button className="text-red-500 text-sm hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                 Remove
                               </button>
                             </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#2B5219] text-lg">₹{item.price * item.quantity}</p>
                            <p className="text-sm text-gray-500">₹{item.price} each</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (5%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg text-gray-900">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Info */}
                  {cartItems.some(item => item.originalPrice > item.price) && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">
                          You saved ₹{cartItems.reduce((savings, item) => 
                            savings + ((item.originalPrice - item.price) * item.quantity), 0
                          )} on this order!
                        </span>
                      </div>
                    </div>
                  )}

                                     <div className="mt-6 space-y-4">
                     <Link href="/checkout" className="block w-full bg-[#2B5219] hover:bg-[#1a3110] text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 text-center">
                       Proceed to Checkout
                     </Link>
                     <Link href="/products" className="block w-full border-2 border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200 text-center">
                       Continue Shopping
                     </Link>
                   </div>

                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Free Shipping</h4>
                        <p className="text-sm text-blue-700">Free delivery on orders above ₹500. Add ₹{500 - subtotal > 0 ? 500 - subtotal : 0} more to get free shipping!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 