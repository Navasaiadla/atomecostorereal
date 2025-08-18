'use client'

import { useEffect, useState } from 'react'
import { auth, products, profiles } from '@/lib/supabase-utils'
import { handleSupabaseError } from '@/lib/supabase-utils'

interface TestResult {
  name: string
  status: 'loading' | 'success' | 'error'
  message: string
}

export default function TestSupabase() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function runTests() {
      const testResults: TestResult[] = []

      // Test 1: Environment Variables
      testResults.push({
        name: 'Environment Variables',
        status: 'loading',
        message: 'Checking environment variables...'
      })

      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

      if (hasUrl && hasAnonKey && hasServiceKey) {
        testResults[0] = {
          name: 'Environment Variables',
          status: 'success',
          message: '✅ All environment variables are set'
        }
      } else {
        testResults[0] = {
          name: 'Environment Variables',
          status: 'error',
          message: `❌ Missing variables: URL(${hasUrl}), AnonKey(${hasAnonKey}), ServiceKey(${hasServiceKey})`
        }
      }

      // Test 2: Authentication
      testResults.push({
        name: 'Authentication',
        status: 'loading',
        message: 'Testing authentication...'
      })

      try {
        const { user, error } = await auth.getCurrentUser()
        if (error) throw error
        
        testResults[1] = {
          name: 'Authentication',
          status: 'success',
          message: user ? `✅ Connected as ${user.email}` : '✅ No user logged in (expected)'
        }
      } catch (error) {
        testResults[1] = {
          name: 'Authentication',
          status: 'error',
          message: `❌ Auth error: ${handleSupabaseError(error)}`
        }
      }

      // Test 3: Database Connection
      testResults.push({
        name: 'Database Connection',
        status: 'loading',
        message: 'Testing database connection...'
      })

      try {
        const { data, error } = await products.getAll()
        if (error) throw error
        
        testResults[2] = {
          name: 'Database Connection',
          status: 'success',
          message: `✅ Connected! Found ${data?.length || 0} products`
        }
      } catch (error) {
        testResults[2] = {
          name: 'Database Connection',
          status: 'error',
          message: `❌ Database error: ${handleSupabaseError(error)}`
        }
      }

      // Test 4: Profiles Table
      testResults.push({
        name: 'Profiles Table',
        status: 'loading',
        message: 'Testing profiles table...'
      })

      try {
        const { data, error } = await profiles.getProfile('test-id')
        // This should fail with "No data found" which is expected
        if (error && error.code === 'PGRST116') {
          testResults[3] = {
            name: 'Profiles Table',
            status: 'success',
            message: '✅ Profiles table accessible (expected no data found)'
          }
        } else if (error) {
          throw error
        } else {
          testResults[3] = {
            name: 'Profiles Table',
            status: 'success',
            message: '✅ Profiles table accessible'
          }
        }
      } catch (error) {
        testResults[3] = {
          name: 'Profiles Table',
          status: 'error',
          message: `❌ Profiles error: ${handleSupabaseError(error)}`
        }
      }

      setResults(testResults)
      setIsLoading(false)
    }

    runTests()
  }, [])

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'loading': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'loading': return '⏳'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Connection Test
          </h1>
          <p className="text-gray-600 mb-8">
            Testing your Supabase integration and API connectivity
          </p>

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Running tests...</span>
            </div>
          )}

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <h3 className="font-semibold text-gray-900">
                      {result.name}
                    </h3>
                  </div>
                  <span className={`font-medium ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 ml-11">
                  {result.message}
                </p>
              </div>
            ))}
          </div>

          {!isLoading && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Next Steps:
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• If all tests pass: Your Supabase is ready to use!</li>
                <li>• If environment variables fail: Add your Supabase keys to .env.local</li>
                <li>• If database fails: Create your database tables using the SQL from SUPABASE_SETUP_GUIDE.md</li>
                <li>• Check the browser console for detailed error messages</li>
              </ul>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              API Examples:
            </h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Get Products:</strong> <code>await products.getAll()</code></p>
              <p><strong>Sign Up:</strong> <code>await auth.signUp(email, password, userData)</code></p>
              <p><strong>Add to Cart:</strong> <code>await cart.addItem(cartItem)</code></p>
              <p><strong>Create Order:</strong> <code>await orders.create(orderData)</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 