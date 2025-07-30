import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Customer Support</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Support Options */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">How Can We Help?</h2>
                
                <div className="space-y-4">
                  <Link href="/faq" className="block p-4 border border-gray-200 rounded-lg hover:border-[#2B5219] transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">Frequently Asked Questions</h3>
                    <p className="text-sm text-gray-600">Find quick answers to common questions</p>
                  </Link>
                  
                  <Link href="/shipping" className="block p-4 border border-gray-200 rounded-lg hover:border-[#2B5219] transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping & Returns</h3>
                    <p className="text-sm text-gray-600">Information about delivery and returns</p>
                  </Link>
                  
                  <Link href="/contact" className="block p-4 border border-gray-200 rounded-lg hover:border-[#2B5219] transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                    <p className="text-sm text-gray-600">Get in touch with our support team</p>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2B5219] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white">📧</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email Support</h3>
                      <p className="text-gray-600">support@atomecostore.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2B5219] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-gray-600">+91 98765 43210</p>
                      <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 6 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#2B5219] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white">💬</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Live Chat</h3>
                      <p className="text-gray-600">Available during business hours</p>
                      <p className="text-sm text-gray-500">Instant responses to your queries</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Support Hours</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? We're here to help!
            </p>
            <Link href="/contact">
              <Button className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-8">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 