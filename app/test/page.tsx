'use client'

import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-600">
          ✅ Website is Working!
        </h1>
        
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Test Components</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Button Test:</h3>
              <div className="flex gap-4">
                <Button>Default Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Colors Test:</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-600 text-white p-4 rounded">Green 600</div>
                <div className="bg-green-100 text-green-800 p-4 rounded">Green 100</div>
                <div className="bg-[#2B5219] text-white p-4 rounded">Custom Green</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Form Test:</h3>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Test input" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-green-600"
                />
                <textarea 
                  placeholder="Test textarea" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:border-green-600"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">
              <strong>✅ Success!</strong> If you can see this page with proper styling, 
              the website is working correctly. You can now go back to the main page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 