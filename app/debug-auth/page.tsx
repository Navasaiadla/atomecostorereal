'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'

export default function DebugAuthPage() {
  const { user, session, loading, isSupabaseAvailable } = useAuth()
  const [envVars, setEnvVars] = useState<any>({})
  const [errors, setErrors] = useState<string[]>([])
  const [authStatus, setAuthStatus] = useState<any>({})
  const [testResults, setTestResults] = useState<any>({})

  useEffect(() => {
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    }
    setEnvVars(envCheck)

    // Check for missing environment variables
    const newErrors = []
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      newErrors.push('NEXT_PUBLIC_SUPABASE_URL is missing')
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      newErrors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length < 100) {
      newErrors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be truncated or invalid')
    }
    setErrors(newErrors)

    // Set auth status
    setAuthStatus({
      user: user ? { id: user.id, email: user.email } : null,
      session: session ? { access_token: session.access_token ? 'Present' : 'Missing' } : null,
      loading,
      isSupabaseAvailable
    })
  }, [user, session, loading, isSupabaseAvailable])

  const testSupabaseConnection = async () => {
    try {
      const response = await fetch('/api/auth/test-connection')
      const result = await response.json()
      setTestResults((prev: any) => ({ ...prev, connection: result }))
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, connection: { error: error instanceof Error ? error.message : 'Unknown error' } }))
    }
  }

  const testProfileCreation = async () => {
    if (!user) {
      setTestResults((prev: any) => ({ ...prev, profile: { error: 'No user logged in' } }))
      return
    }

    try {
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user })
      })
      const result = await response.json()
      setTestResults((prev: any) => ({ ...prev, profile: result }))
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, profile: { error: error instanceof Error ? error.message : 'Unknown error' } }))
    }
  }

  const testAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status')
      const result = await response.json()
      setTestResults((prev: any) => ({ ...prev, authStatus: result }))
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, authStatus: { error: error instanceof Error ? error.message : 'Unknown error' } }))
    }
  }

  const testButtonClick = () => {
    alert('Button click is working!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Authentication Debug Center</h1>
          
          {/* Environment Variables Check */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🌐 Environment Variables</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(envVars, null, 2)}
              </pre>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Authentication Status</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(authStatus, null, 2)}
              </pre>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-900 mb-4">❌ Errors Found</h2>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <ul className="list-disc list-inside text-red-800">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧪 Test Results</h2>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(testResults, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Test Buttons */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🧪 Test Functions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testButtonClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test Button Click
              </button>
              
              <button
                onClick={testSupabaseConnection}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Supabase Connection
              </button>
              
              <button
                onClick={testProfileCreation}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Test Profile Creation
              </button>
              
              <button
                onClick={testAuthStatus}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Test Auth Status
              </button>
              
              <button
                onClick={() => window.location.href = '/login'}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Go to Login Page
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 How to Fix Issues</h2>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <ol className="list-decimal list-inside text-blue-800 space-y-2">
                <li><strong>Environment Variables:</strong> Ensure your `.env.local` file has complete Supabase credentials</li>
                <li><strong>Restart Server:</strong> After updating environment variables, restart your development server</li>
                <li><strong>Check Supabase:</strong> Verify your Supabase project is active and accessible</li>
                <li><strong>Database Tables:</strong> Ensure the `profiles` table exists in your Supabase database</li>
                <li><strong>RLS Policies:</strong> Check Row Level Security policies allow profile creation</li>
              </ol>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔗 Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/login"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Login Page
              </a>
              <a
                href="/register"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Register Page
              </a>
              <a
                href="/test-auth"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Test Auth Page
              </a>
              <a
                href="/debug-role"
                className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Debug Role Page
              </a>
            </div>
          </div>

          {/* Current User Info */}
          {user && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">👤 Current User</h2>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 