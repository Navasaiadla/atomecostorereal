'use client'

import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RazorpayButton } from '@/components/ui/razorpay-button'
import { useCart } from '@/lib/cart-context'

export default function CheckoutPage() {
  const { items } = useCart()
  const [remoteTotals, setRemoteTotals] = useState<{subtotal:number;shipping:number;tax:number;total:number;items:any[]} | null>(null)
  const [productIdFromUrl, setProductIdFromUrl] = useState<string | null>(null)

  useEffect(() => {
    async function loadPricing() {
      try {
        const url = new URL(window.location.href)
        const productId = url.searchParams.get('productId')
        setProductIdFromUrl(productId)
        const qty = url.searchParams.get('qty')
        const qs = productId ? `?productId=${encodeURIComponent(productId)}${qty ? `&qty=${encodeURIComponent(qty)}` : ''}` : ''
        const res = await fetch(`/api/checkout/price${qs}`, { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setRemoteTotals(data)
        }
      } catch {}
    }
    loadPricing()
  }, [items.length])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay',
  })

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [paymentMessage, setPaymentMessage] = useState('')

  function getLocalPhoneDigits(value: string) {
    const digitsOnly = value.replace(/\D/g, '')
    // Accept inputs like +91XXXXXXXXXX or 0091XXXXXXXXXX by taking last 10 digits
    if (digitsOnly.length >= 10) return digitsOnly.slice(-10)
    return digitsOnly
  }

  function validateForm() {
    const errors: { [key: string]: string } = {}
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address'
    // Normalize phone; allow country code by validating last 10 local digits
    const phoneDigits = getLocalPhoneDigits(formData.phone)
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    else if (phoneDigits.length !== 10) errors.phone = 'Please enter a valid phone number (10 local digits)'
    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    const pincodeDigits = formData.pincode.replace(/\D/g, '')
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required'
    else if (!/^[0-9]{6}$/.test(pincodeDigits)) errors.pincode = 'Please enter a valid 6-digit pincode'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function isFormValid() {
    // First/last name are optional for enabling payment; they will be collected at fulfillment
    const firstNameValid = true
    const lastNameValid = true
    const emailValid = formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const phoneDigits = getLocalPhoneDigits(formData.phone)
    const phoneValid = formData.phone.trim().length > 0 && phoneDigits.length === 10
    const addressValid = formData.address.trim().length > 0
    const cityValid = formData.city.trim().length > 0
    const stateValid = formData.state.trim().length > 0
    const pincodeDigits = formData.pincode.replace(/\D/g, '')
    const pincodeValid = formData.pincode.trim().length > 0 && /^[0-9]{6}$/.test(pincodeDigits)
    return firstNameValid && lastNameValid && emailValid && phoneValid && addressValid && cityValid && stateValid && pincodeValid
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateForm()) {
      setPaymentMessage('Please fill in all required fields correctly.')
      return
    }
  }

  function handlePaymentSuccess(response: any) {
    setPaymentStatus('success')
    setPaymentMessage(`Payment successful! Order ID: ${response.razorpay_order_id}`)
    const orderId = response?.razorpay_order_id || ''
    const paymentId = response?.razorpay_payment_id || ''
    window.location.href = `/payment-success?order_id=${encodeURIComponent(orderId)}&payment_id=${encodeURIComponent(paymentId)}`
  }

  function handlePaymentFailure(error: any) {
    setPaymentStatus('failed')
    const errorMessage = error?.message || error?.toString() || 'Payment failed. Please try again.'
    setPaymentMessage(errorMessage)
  }

  const localSubtotal = items.reduce((sum: number, it: any) => sum + (Number(it.price || 0) * Number(it.quantity || 0)), 0)
  const localShipping = localSubtotal >= 500 ? 0 : (localSubtotal > 0 ? 50 : 0)
  const localTax = Math.round(localSubtotal * 0.1)
  const localTotal = localSubtotal + localShipping + localTax
  const subtotal = remoteTotals?.subtotal ?? localSubtotal
  const shipping = remoteTotals?.shipping ?? localShipping
  const tax = remoteTotals?.tax ?? localTax
  const totalAmount = remoteTotals?.total ?? localTotal
  const hasItems = (remoteTotals?.items && remoteTotals.items.length > 0) || items.length > 0
  const canPay = isFormValid() && hasItems && totalAmount > 0

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb removed per request */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete address"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#2B5219] ${
                        formErrors.pincode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.pincode && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                  >
                    <option value="razorpay">Online Payment (Razorpay)</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>

                {/* Payment Buttons */}
                <div>
                  {hasItems ? (
                    <RazorpayButton
                      amount={totalAmount}
                      isCod={formData.paymentMethod === 'cod'}
                      productId={productIdFromUrl || (remoteTotals?.items?.[0]?.id ?? items?.[0]?.id) || null}
                      address={formData.address}
                      city={formData.city}
                      state={formData.state}
                      pincode={formData.pincode}
                      customerName={`${formData.firstName} ${formData.lastName}`}
                      customerEmail={formData.email}
                      customerPhone={formData.phone}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                      className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                        canPay
                          ? 'bg-[#2B5219] hover:bg-[#1a3110] text-white cursor-pointer shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!canPay}
                    >
                      {canPay
                        ? (formData.paymentMethod === 'cod' ? 'Place COD Order' : `Pay ₹${totalAmount}`)
                        : 'Fill all fields to proceed'}
                    </RazorpayButton>
                  ) : (
                    <Button disabled className="w-full bg-gray-300 text-gray-500 py-3 text-lg font-semibold">
                      No items to pay
                    </Button>
                  )}
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm h-fit">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Order Summary</h2>
              
              {/* Items from cart */}
              { (remoteTotals?.items?.length || items.length) > 0 ? (
                <div className="border-b border-gray-200 pb-4 mb-4 space-y-3">
                  {(remoteTotals?.items || items).map((it: any) => (
                    <div key={it.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={it.image || it.images?.[0] || '/products/bamboo-utensils.svg'} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/products/bamboo-utensils.svg' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{it.name || it.title}</h3>
                        <p className="text-sm text-gray-600">Qty: {it.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2B5219]">₹{it.line_total ?? (Number(it.price) * Number(it.quantity))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Free delivery on orders above ₹500</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


