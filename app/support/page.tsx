'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

export default function SupportPage() {
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
                <li className="text-gray-900">Support</li>
              </ol>
            </nav>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Support</h1>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Having Payment Issues?</h2>
                  <p className="text-gray-600 mb-4">
                    We're here to help you resolve any payment-related problems. Here are some common solutions:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2B5219] rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-medium text-gray-900">Check Your Payment Method</h3>
                        <p className="text-sm text-gray-600">Ensure your card is valid and has sufficient funds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2B5219] rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-medium text-gray-900">Try a Different Browser</h3>
                        <p className="text-sm text-gray-600">Sometimes browser extensions can interfere with payments</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2B5219] rounded-full mt-2"></div>
                      <div>
                        <h3 className="font-medium text-gray-900">Contact Your Bank</h3>
                        <p className="text-sm text-gray-600">Your bank might be blocking the transaction for security</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Need More Help?</h2>
                  <p className="text-gray-600 mb-4">
                    If you're still experiencing issues, please contact our support team:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
                      <p className="text-sm text-gray-600 mb-2">support@atomecostore.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Phone Support</h3>
                      <p className="text-sm text-gray-600 mb-2">+91 98765 43210</p>
                      <p className="text-xs text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/checkout">
                      <Button className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-6 py-3">
                        Try Payment Again
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white px-6 py-3">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
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