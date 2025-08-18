'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

export default function DebugCart() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const testCartAPI = async () => {
    try {
      setError(null)
      setApiResponse(null)

      // Test GET cart
      console.log('Testing GET /api/cart...')
      const getResponse = await fetch('/api/cart', {
        credentials: 'include',
      })
      
      const getData = await getResponse.json()
      console.log('GET Response:', getResponse.status, getData)
      
      setApiResponse({
        method: 'GET',
        status: getResponse.status,
        data: getData
      })

      if (!getResponse.ok) {
        setError(`GET failed: ${getResponse.status} - ${getData.error}`)
        return
      }

      // Test POST cart
      console.log('Testing POST /api/cart...')
      const postResponse = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product_id: 'b42e8e75-588f-4df3-ac35-99e3dba6c0c5', // Use a real product ID
          quantity: 1 
        }),
        credentials: 'include',
      })
      
      const postData = await postResponse.json()
      console.log('POST Response:', postResponse.status, postData)
      
      setApiResponse({
        method: 'POST',
        status: postResponse.status,
        data: postData
      })

      if (!postResponse.ok) {
        setError(`POST failed: ${postResponse.status} - ${postData.error}`)
      }

    } catch (err) {
      console.error('API test error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const testDirectSupabase = async () => {
    try {
      setError(null)
      setApiResponse(null)

      const supabase = createClient()
      
      // Test direct Supabase call
      console.log('Testing direct Supabase call...')
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .limit(5)

      console.log('Direct Supabase result:', { data, error })
      
      setApiResponse({
        method: 'Direct Supabase',
        data: data,
        error: error
      })

      if (error) {
        setError(`Direct Supabase failed: ${error.message}`)
      }

    } catch (err) {
      console.error('Direct Supabase test error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Cart Debug</h1>
      
      {/* User Status */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">User Status</h2>
        {user ? (
          <div>
            <p><strong>Logged in:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        ) : (
          <div>
            <p><strong>Status:</strong> Not logged in</p>
            <p className="text-red-600">You need to log in to test cart functionality</p>
          </div>
        )}
      </div>

      {/* Test Buttons */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-y-4">
          <Button 
            onClick={testCartAPI}
            disabled={!user}
            className="bg-blue-600 hover:bg-blue-700 mr-4"
          >
            Test Cart API
          </Button>
          
          <Button 
            onClick={testDirectSupabase}
            disabled={!user}
            className="bg-green-600 hover:bg-green-700"
          >
            Test Direct Supabase
          </Button>
          
          <div className="text-sm text-gray-600">
            <p>• Test Cart API: Tests the /api/cart endpoint</p>
            <p>• Test Direct Supabase: Tests direct database access</p>
            <p>• Check browser console for detailed logs</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* API Response Display */}
      {apiResponse && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">API Response</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>Method:</strong> {apiResponse.method}</p>
            {apiResponse.status && <p><strong>Status:</strong> {apiResponse.status}</p>}
            <p><strong>Data:</strong></p>
            <pre className="text-sm overflow-auto bg-white p-2 border rounded mt-2">
              {JSON.stringify(apiResponse.data, null, 2)}
            </pre>
            {apiResponse.error && (
              <>
                <p><strong>Error:</strong></p>
                <pre className="text-sm overflow-auto bg-red-50 p-2 border rounded mt-2">
                  {JSON.stringify(apiResponse.error, null, 2)}
                </pre>
              </>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debugging Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you're logged in</li>
          <li>Click "Test Cart API" to test the API endpoints</li>
          <li>Click "Test Direct Supabase" to test database access</li>
          <li>Check the browser console for detailed logs</li>
          <li>Look at the API Response section for results</li>
          <li>If there are errors, they will be displayed above</li>
        </ol>
      </div>
    </div>
  )
}
