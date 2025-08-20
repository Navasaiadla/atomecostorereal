import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-gray-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          The seller dashboard page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="space-y-3">
          <Link href="/seller/dashboard">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}








































