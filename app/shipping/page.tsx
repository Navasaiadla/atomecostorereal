export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Shipping & Returns</h1>
          
          <div className="space-y-12">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Shipping Information</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Options</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2B5219] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🚚</span>
                      </div>
                      <div>
                        <p className="font-medium">Standard Delivery</p>
                        <p className="text-sm text-gray-600">3-5 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#2B5219] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⚡</span>
                      </div>
                      <div>
                        <p className="font-medium">Express Delivery</p>
                        <p className="text-sm text-gray-600">1-2 business days</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Costs</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders above ₹999</span>
                      <span className="font-medium text-[#2B5219]">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Orders below ₹999</span>
                      <span className="font-medium">₹99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Express Delivery</span>
                      <span className="font-medium">₹199</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Returns & Refunds</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 30-day return window for all products</li>
                    <li>• Products must be in original condition</li>
                    <li>• Original packaging required</li>
                    <li>• Free return shipping for defective items</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Process</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white">1</span>
                      </div>
                      <p className="text-sm font-medium">Initiate Return</p>
                      <p className="text-xs text-gray-600">Contact our support team</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white">2</span>
                      </div>
                      <p className="text-sm font-medium">Ship Back</p>
                      <p className="text-xs text-gray-600">Return the product</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white">3</span>
                      </div>
                      <p className="text-sm font-medium">Get Refund</p>
                      <p className="text-xs text-gray-600">Within 5-7 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eco-Friendly Packaging */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Eco-Friendly Packaging</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Commitment</h3>
                  <p className="text-gray-600 mb-4">
                    We believe in sustainable packaging that protects your products while protecting our planet.
                  </p>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 100% recyclable packaging materials</li>
                    <li>• Biodegradable packing peanuts</li>
                    <li>• Minimal plastic usage</li>
                    <li>• Reusable packaging where possible</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging Materials</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">Kraft paper boxes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">Recycled cardboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">Paper tape</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">Biodegradable fillers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 