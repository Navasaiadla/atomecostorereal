'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'

export default function TestAuthPage() {
  const { user, session, loading } = useAuth()
  const [authData, setAuthData] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const checkAuth = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/auth/debug')
      const data = await response.json()
      setAuthData(data)
    } catch (error) {
      setAuthData({ error: 'Failed to check auth', details: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔐 Authentication Test</h1>
          
          {/* Client-side Auth Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client-Side Auth Status</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-600">User</p>
                  <p className="text-lg font-bold text-blue-900">{user ? '✅ Logged In' : '❌ Not Logged In'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Session</p>
                  <p className="text-lg font-bold text-blue-900">{session ? '✅ Active' : '❌ None'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Loading</p>
                  <p className="text-lg font-bold text-blue-900">{loading ? '⏳ Yes' : '✅ No'}</p>
                </div>
              </div>
              
              {user && (
                <div className="mt-4 bg-green-50 p-3 rounded border border-green-200">
                  <p className="text-green-800"><strong>User ID:</strong> {user.id}</p>
                  <p className="text-green-800"><strong>Email:</strong> {user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Server-side Auth Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Server-Side Auth Status</h2>
            <div className="mb-4">
              <Button
                onClick={checkAuth}
                disabled={testing}
                className="bg-green-600 hover:bg-green-700"
              >
                {testing ? 'Checking...' : 'Check Server Auth'}
              </Button>
            </div>
            
            {authData && (
              <div className="space-y-4">
                {/* Authentication Status */}
                <div className={`p-4 rounded-lg border ${
                  authData.authenticated ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className="font-semibold mb-2">Authentication Status</h3>
                  <p>Authenticated: {authData.authenticated ? '✅ Yes' : '❌ No'}</p>
                  <p>Session Exists: {authData.session?.exists ? '✅ Yes' : '❌ No'}</p>
                  <p>User Exists: {authData.user?.exists ? '✅ Yes' : '❌ No'}</p>
                </div>

                {/* Session Details */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2">Session Details</h3>
                  <p>Exists: {authData.session?.exists ? '✅ Yes' : '❌ No'}</p>
                  <p>Error: {authData.session?.error || 'None'}</p>
                  <p>Expires: {authData.session?.expires_at || 'None'}</p>
                  <p>Refresh Token: {authData.session?.refresh_token ? '✅ Yes' : '❌ No'}</p>
                  <p>Access Token: {authData.session?.access_token ? '✅ Yes' : '❌ No'}</p>
                </div>

                {/* User Details */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold mb-2">User Details</h3>
                  <p>Exists: {authData.user?.exists ? '✅ Yes' : '❌ No'}</p>
                  <p>Error: {authData.user?.error || 'None'}</p>
                  <p>ID: {authData.user?.id || 'None'}</p>
                  <p>Email: {authData.user?.email || 'None'}</p>
                </div>

                {/* Cookies */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold mb-2">Cookies</h3>
                  <p>Total Cookies: {authData.cookies?.total}</p>
                  <p>Supabase Cookies: {authData.cookies?.supabase?.length || 0}</p>
                  <div className="mt-2">
                    <p className="text-sm font-semibold">Supabase Cookie Names:</p>
                    <ul className="text-xs space-y-1">
                      {authData.cookies?.supabase?.map((cookie: any, index: number) => (
                        <li key={index}>• {cookie.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Raw Data */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Raw Data</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(authData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Test Cart */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Cart Functionality</h2>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = '/debug-auth-cart'}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Go to Cart Debug Page
              </Button>
              
              <Button
                onClick={() => window.location.href = '/products'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Go to Products
              </Button>
              
              <Button
                onClick={() => window.location.href = '/login'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Go to Login
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold mb-2">Troubleshooting Steps</h3>
            <ol className="list-decimal list-inside text-yellow-800 space-y-1">
              <li>Check if you're logged in (Client-Side Auth Status should show ✅)</li>
              <li>Check Server-Side Auth Status (should also show ✅)</li>
              <li>If both show ✅ but cart still redirects, there's a cookie issue</li>
              <li>Try logging out and logging back in</li>
              <li>Check browser console for any errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
} 