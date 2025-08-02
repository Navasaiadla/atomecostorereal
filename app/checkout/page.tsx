'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { RazorpayButton } from '@/components/ui/razorpay-button'

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  })

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')
  const [paymentMessage, setPaymentMessage] = useState('')

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required'
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required'
    }
    
    if (!formData.pincode.trim()) {
      errors.pincode = 'Pincode is required'
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit pincode'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Check if form is valid for payment
  const isFormValid = () => {
    const firstNameValid = formData.firstName.trim().length > 0
    const lastNameValid = formData.lastName.trim().length > 0
    const emailValid = formData.email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const phoneValid = formData.phone.trim().length > 0 && /^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))
    const addressValid = formData.address.trim().length > 0
    const cityValid = formData.city.trim().length > 0
    const stateValid = formData.state.trim().length > 0
    const pincodeValid = formData.pincode.trim().length > 0 && /^[0-9]{6}$/.test(formData.pincode)
    
    const isValid = firstNameValid && lastNameValid && emailValid && phoneValid && 
                   addressValid && cityValid && stateValid && pincodeValid
    
    // Debug logging
    console.log('Form validation:', {
      firstName: firstNameValid,
      lastName: lastNameValid,
      email: emailValid,
      phone: phoneValid,
      address: addressValid,
      city: cityValid,
      state: stateValid,
      pincode: pincodeValid,
      isValid
    })
    
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setPaymentMessage('Please fill in all required fields correctly.')
      return
    }
    
    // Handle checkout logic here
    console.log('Checkout data:', formData)
    // Here you can proceed with the order placement
  }

  const handlePaymentSuccess = (response: any) => {
    console.log('✅ handlePaymentSuccess called with:', response)
    setPaymentStatus('success')
    setPaymentMessage(`Payment successful! Order ID: ${response.razorpay_order_id}`)
    console.log('Payment successful:', response)
    
    // Redirect to home page after successful payment
    setTimeout(() => {
      console.log('🔄 Redirecting to home page...')
      window.location.href = '/'
    }, 3000) // Redirect after 3 seconds to show success message
  }

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus('failed')
    const errorMessage = error?.message || error?.toString() || 'Payment failed. Please try again.'
    setPaymentMessage(errorMessage)
    console.error('Payment failed:', error)
  }

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
                <li><Link href="/cart" className="hover:text-[#2B5219]">Cart</Link></li>
                <li>/</li>
                <li className="text-gray-900">Checkout</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Checkout Form */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      <option value="cod">Cash on Delivery</option>
                      <option value="razorpay">Online Payment (Razorpay)</option>
                    </select>
                  </div>

                  {/* Form Validation Status */}
                  {formData.paymentMethod === 'razorpay' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">Form Validation Status:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className={`flex items-center gap-2 ${formData.firstName.trim() ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.firstName.trim() ? '✅' : '❌'}</span>
                          <span>First Name</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.lastName.trim() ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.lastName.trim() ? '✅' : '❌'}</span>
                          <span>Last Name</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? '✅' : '❌'}</span>
                          <span>Email</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.phone.trim() && /^[0-9]{10}$/.test(formData.phone.replace(/\s/g, '')) ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.phone.trim() && /^[0-9]{10}$/.test(formData.phone.replace(/\s/g, '')) ? '✅' : '❌'}</span>
                          <span>Phone (10 digits)</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.address.trim() ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.address.trim() ? '✅' : '❌'}</span>
                          <span>Address</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.city.trim() ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.city.trim() ? '✅' : '❌'}</span>
                          <span>City</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.state.trim() ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.state.trim() ? '✅' : '❌'}</span>
                          <span>State</span>
                        </div>
                        <div className={`flex items-center gap-2 ${formData.pincode.trim() && /^[0-9]{6}$/.test(formData.pincode) ? 'text-green-600' : 'text-red-600'}`}>
                          <span>{formData.pincode.trim() && /^[0-9]{6}$/.test(formData.pincode) ? '✅' : '❌'}</span>
                          <span>Pincode (6 digits)</span>
                        </div>
                      </div>
                    </div>
                  )}

                                     {/* Payment Status Messages */}
                   {paymentStatus === 'success' && (
                     <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                       <div className="flex items-center gap-2 text-green-700 mb-2">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                         <span className="font-medium">{paymentMessage}</span>
                       </div>
                       <p className="text-sm text-green-600">
                         Redirecting to home page in 2 seconds...
                       </p>
                     </div>
                   )}

                  {paymentStatus === 'failed' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="font-medium">{paymentMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Buttons */}
                  {formData.paymentMethod === 'razorpay' ? (
                    <div>
                      {!isFormValid() && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                          <div className="flex items-center gap-2 text-yellow-700 mb-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-medium">Please fill in all required fields before proceeding to payment</span>
                          </div>
                          <div className="text-sm text-yellow-600">
                            <p>Required fields: First Name, Last Name, Email, Phone (10 digits), Address, City, State, Pincode (6 digits)</p>
                          </div>
                        </div>
                      )}
                      <RazorpayButton
                        amount={269} // Total amount from order summary
                        customerName={`${formData.firstName} ${formData.lastName}`}
                        customerEmail={formData.email}
                        customerPhone={formData.phone}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                          isFormValid() 
                            ? 'bg-[#2B5219] hover:bg-[#1a3110] text-white cursor-pointer shadow-lg hover:shadow-xl' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!isFormValid()}
                      >
                        {isFormValid() ? 'Pay ₹269' : 'Fill all fields to proceed'}
                      </RazorpayButton>
                    </div>
                  ) : (
                    <Button 
                      type="submit" 
                      className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white py-3 text-lg font-semibold"
                    >
                      Place Order (Cash on Delivery)
                    </Button>
                  )}
                </form>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl p-8 shadow-sm h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Sample Product */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Product</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Eco-Friendly Shopping Bag</h3>
                      <p className="text-sm text-gray-600">Quantity: 1</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#2B5219]">₹199</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹199</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>₹50</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹20</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>₹269</span>
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
      </main>
      <Footer />
    </div>
  )
} 