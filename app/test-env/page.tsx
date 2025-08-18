'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function TestEnvPage() {
  const [envData, setEnvData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkEnv = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-env')
      const data = await response.json()
      setEnvData(data)
    } catch (error) {
      setEnvData({ error: 'Failed to check environment variables' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnv()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Environment Variables Test</h1>
          
          <div className="mb-8">
            <Button
              onClick={checkEnv}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Checking...' : 'Check Environment Variables'}
            </Button>
          </div>

          {envData && (
            <div className="space-y-6">
              {/* Supabase URL */}
              <div className={`p-4 rounded-lg border ${
                envData.supabaseUrl?.exists ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">Supabase URL</h3>
                <p>Exists: {envData.supabaseUrl?.exists ? '✅ Yes' : '❌ No'}</p>
                <p>Length: {envData.supabaseUrl?.length}</p>
                <p>Value: {envData.supabaseUrl?.value || 'Not set'}</p>
              </div>

              {/* Supabase Anon Key */}
              <div className={`p-4 rounded-lg border ${
                envData.supabaseAnonKey?.exists && envData.anonKeyComplete ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">Supabase Anon Key</h3>
                <p>Exists: {envData.supabaseAnonKey?.exists ? '✅ Yes' : '❌ No'}</p>
                <p>Length: {envData.supabaseAnonKey?.length}</p>
                <p>Complete: {envData.anonKeyComplete ? '✅ Yes' : '❌ No (truncated)'}</p>
                <p>Value: {envData.supabaseAnonKey?.value || 'Not set'}</p>
              </div>

              {/* Service Key */}
              <div className={`p-4 rounded-lg border ${
                envData.serviceKey?.exists ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">Service Role Key</h3>
                <p>Exists: {envData.serviceKey?.exists ? '✅ Yes' : '❌ No'}</p>
                <p>Length: {envData.serviceKey?.length}</p>
                <p>Value: {envData.serviceKey?.value || 'Not set'}</p>
              </div>

              {/* Summary */}
              <div className={`p-4 rounded-lg border ${
                envData.allSet && envData.anonKeyComplete ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p>All Required Variables: {envData.allSet ? '✅ Yes' : '❌ No'}</p>
                <p>Anon Key Complete: {envData.anonKeyComplete ? '✅ Yes' : '❌ No'}</p>
                <p>Configuration Status: {envData.allSet && envData.anonKeyComplete ? '✅ Ready' : '⚠️ Needs Fix'}</p>
              </div>

              {/* Fix Instructions */}
              {(!envData.allSet || !envData.anonKeyComplete) && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold mb-2">How to Fix</h3>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                    <li>Delete the current <code className="bg-yellow-100 px-1 rounded">.env.local</code> file</li>
                    <li>Create a new <code className="bg-yellow-100 px-1 rounded">.env.local</code> file with these exact values:</li>
                    <li className="ml-4">
                      <code className="bg-yellow-100 px-1 rounded block mt-2 text-xs">
                        NEXT_PUBLIC_SUPABASE_URL=https://grdxbgawbqhsndmdgxxs.supabase.co<br/>
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZHhiZ2F3YnFoc25kbWRneHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjQzMjUsImV4cCI6MjA2NzAwMDMyNX0.wsh2GdoBBjYebBGPkZtq9dEfJcDsU_UCZMD-KVdQvG4<br/>
                        SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZHhiZ2F3YnFoc25kbWRneHhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQyNDMyNSwiZXhwIjoyMDY3MDAwMzI1fQ.W0KaJwhTF5_catXL903ls0pTVMgLURo6Oetsdyi5AFs<br/>
                        NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_GfkQNpFXCaIeqe
                      </code>
                    </li>
                    <li>Restart your development server</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              )}

              {/* Raw Data */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Raw Data</h3>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(envData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
