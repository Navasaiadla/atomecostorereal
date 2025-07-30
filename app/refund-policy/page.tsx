export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Refund Policy</h1>
          
          <div className="bg-white rounded-2xl p-8">
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-600 mb-6">
                Last updated: January 2024
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">1. Return Window</h2>
                <p className="text-gray-600 mb-4">
                  We offer a 30-day return window for all products purchased from Atom Eco Store. The return period starts from the date of delivery.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">2. Return Conditions</h2>
                <p className="text-gray-600 mb-4">To be eligible for a return, your item must be:</p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• In its original condition</li>
                  <li>• Unused and unwashed</li>
                  <li>• In the original packaging</li>
                  <li>• Within the 30-day return window</li>
                  <li>• Not a final sale item</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">3. How to Initiate a Return</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Contact Support</h3>
                    <p className="text-sm text-gray-600">Email us at support@atomecostore.com with your order number</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Get Return Label</h3>
                    <p className="text-sm text-gray-600">We'll provide you with a prepaid return shipping label</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Ship Back</h3>
                    <p className="text-sm text-gray-600">Package the item securely and drop it off</p>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">4. Refund Process</h2>
                <p className="text-gray-600 mb-4">
                  Once we receive your returned item, we will inspect it and notify you of the refund status:
                </p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• If approved, your refund will be processed within 5-7 business days</li>
                  <li>• Refunds will be issued to the original payment method</li>
                  <li>• You will receive an email confirmation when the refund is processed</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">5. Shipping Costs</h2>
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-[#2B5219] mb-3">Free Returns</h3>
                  <p className="text-gray-600 mb-3">
                    We provide free return shipping for all eligible returns. Simply use the prepaid return label we provide.
                  </p>
                  <p className="text-sm text-gray-600">
                    Note: Return shipping costs for international orders may vary.
                  </p>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">6. Non-Returnable Items</h2>
                <p className="text-gray-600 mb-4">The following items are not eligible for returns:</p>
                <ul className="text-gray-600 space-y-2 ml-6">
                  <li>• Personalized or custom items</li>
                  <li>• Items marked as "Final Sale"</li>
                  <li>• Damaged items due to customer misuse</li>
                  <li>• Items without original packaging</li>
                  <li>• Items returned after 30 days</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">7. Damaged or Defective Items</h2>
                <p className="text-gray-600 mb-4">
                  If you receive a damaged or defective item, please contact us immediately. We will provide a replacement or full refund, including shipping costs.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">8. Exchanges</h2>
                <p className="text-gray-600 mb-4">
                  We currently do not offer direct exchanges. If you need a different size or color, please return the original item and place a new order.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">9. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  For any questions about returns or refunds, please contact our customer support team:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 mb-2">
                    <strong>Email:</strong> support@atomecostore.com
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Phone:</strong> +91 98765 43210
                  </p>
                  <p className="text-gray-600">
                    <strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 