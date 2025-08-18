'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TestHome() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test if the page loads without errors
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="p-8">Loading test page...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
          🎉 Test Page Working!
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✅ Basic Functionality Test</h2>
          <p className="text-gray-600 mb-4">
            If you can see this page, the basic Next.js setup is working correctly.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/" 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Go to Homepage
            </Link>
            
            <Link 
              href="/products" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Go to Products
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 What Was Fixed</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Removed onError handler from server component Image</li>
            <li>✅ Updated categories API to use new Supabase client</li>
            <li>✅ Cleared Next.js cache to resolve build issues</li>
            <li>✅ Fixed "Event handlers cannot be passed to Client Component props" error</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Next Steps</h2>
          <ol className="space-y-2 text-gray-600 list-decimal list-inside">
            <li>Click "Go to Homepage" to test the main site</li>
            <li>Check if the navigation and cart are working</li>
            <li>Verify that featured products load from database</li>
            <li>Test the cart functionality</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
