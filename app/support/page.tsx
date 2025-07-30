import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CustomerSupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Customer Support</h1>
      <div className="space-y-8">
        <p className="text-gray-700 text-lg">
          We're here to help! Get assistance with orders, products, returns, or any questions you might have about Atom Eco Store.
        </p>

        {/* Quick Contact Options */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-blue-900 mb-2">General Support</h3>
            <p className="text-blue-700 font-medium">atomecostores@gmail.com</p>
            <p className="text-sm text-blue-600 mt-2">Orders, products, general inquiries</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="text-3xl mb-3">📞</div>
            <h3 className="font-semibold text-green-900 mb-2">Phone Support</h3>
            <p className="text-green-700 font-medium">+91-9390119683</p>
            <p className="text-sm text-green-600 mt-2">Urgent issues, instant help</p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-gray-900">🕒 Business Hours</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p><strong>Email Support:</strong> 24/7 (Response within 2-4 hours)</p>
              <p><strong>Phone Support:</strong> Monday to Friday, 9:00 AM to 6:00 PM (IST)</p>
            </div>
            <div>
              <p><strong>Weekend Support:</strong> Saturday 10:00 AM to 4:00 PM</p>
              <p><strong>Holidays:</strong> Limited support via email only</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">📋 Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-gray-900 cursor-pointer">How can I track my order?</summary>
              <p className="mt-2 text-gray-700">Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order from your account dashboard.</p>
            </details>
            
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-gray-900 cursor-pointer">What is your return policy?</summary>
              <p className="mt-2 text-gray-700">We offer a 7-day return policy for unused items in original packaging. Some hygiene and personal care items are non-returnable for safety reasons.</p>
            </details>
            
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-gray-900 cursor-pointer">Do you offer free shipping?</summary>
              <p className="mt-2 text-gray-700">Yes! We offer free shipping on all orders above ₹999. For orders below ₹999, standard shipping charges apply.</p>
            </details>
            
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-gray-900 cursor-pointer">How do I become a seller?</summary>
              <p className="mt-2 text-gray-700">Contact us at sellers@atomstore.in with your business details and product information. Our team will guide you through the onboarding process.</p>
            </details>
            
            <details className="bg-white border border-gray-200 rounded-lg p-4">
              <summary className="font-medium text-gray-900 cursor-pointer">Are all products really eco-friendly?</summary>
              <p className="mt-2 text-gray-700">Yes! Every product undergoes strict sustainability verification. We ensure all items meet our environmental standards and ethical sourcing requirements.</p>
            </details>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-green-900">💬 Send us a Message</h2>
          <p className="text-green-700 mb-4">
            Can't find what you're looking for? Send us a detailed message and we'll get back to you within 24 hours.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="font-medium text-green-800">Product Issues</p>
              <p className="text-sm text-green-600">support@atomstore.in</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-green-800">Order Problems</p>
              <p className="text-sm text-green-600">orders@atomstore.in</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-green-800">General Inquiries</p>
              <p className="text-sm text-green-600">+91-9876543210</p>
            </div>
          </div>
        </div>

        {/* Office Information */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-blue-900">🏢 Our Office</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-medium text-blue-800">Atom Eco Store Headquarters</p>
              <p className="text-blue-700">Hyderabad, Telangana, India</p>
              <p className="text-sm text-blue-600 mt-2">
                We're committed to serving customers across India with sustainable products and exceptional service.
              </p>
            </div>
            <div>
              <p className="font-medium text-blue-800">Service Areas</p>
              <p className="text-blue-700">All major Indian cities</p>
              <p className="text-sm text-blue-600 mt-2">
                Fast delivery to metro cities (3-5 days) and tier-2 cities (5-7 days).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 