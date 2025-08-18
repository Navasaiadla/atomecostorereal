'use client'

import { useEffect, useState } from 'react'

interface StatusData {
  environment: {
    hasUrl: boolean
    hasAnonKey: boolean
    hasServiceKey: boolean
    urlIsValid: boolean
    anonKeyIsValid: boolean
    serviceKeyIsValid: boolean
    allValid: boolean
  }
  connection: {
    authWorking: boolean
    dbAccessible: boolean
    readyForTables: boolean
  }
  message: string
}

export default function SupabaseStatus() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        // Check environment variables
        const envResponse = await fetch('/api/test-supabase')
        const envData = await envResponse.json()
        setEnvStatus(envData)

        // Check connection
        const connResponse = await fetch('/api/test-supabase-connection')
        const connData = await connResponse.json()
        setConnectionStatus(connData)
      } catch (error) {
        console.error('Error checking status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking Supabase status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supabase Status Check
          </h1>
          <p className="text-gray-600 mb-8">
            Checking your Supabase configuration and connection
          </p>

          {/* Environment Variables Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Environment Variables
            </h2>
            {envStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Project URL</span>
                  <span className={envStatus.environment.urlIsValid ? 'text-green-600' : 'text-red-600'}>
                    {envStatus.environment.urlIsValid ? '✅ Valid' : '❌ Invalid/Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Anon Key</span>
                  <span className={envStatus.environment.anonKeyIsValid ? 'text-green-600' : 'text-red-600'}>
                    {envStatus.environment.anonKeyIsValid ? '✅ Valid' : '❌ Invalid/Missing'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Service Key</span>
                  <span className={envStatus.environment.serviceKeyIsValid ? 'text-green-600' : 'text-red-600'}>
                    {envStatus.environment.serviceKeyIsValid ? '✅ Valid' : '❌ Invalid/Missing'}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <p className="text-blue-800">{envStatus.message}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-600">Failed to check environment variables</p>
            )}
          </div>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Connection Status
            </h2>
            {connectionStatus ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Authentication</span>
                  <span className={connectionStatus.summary.authWorking ? 'text-green-600' : 'text-red-600'}>
                    {connectionStatus.summary.authWorking ? '✅ Working' : '❌ Failed'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Database Access</span>
                  <span className={connectionStatus.summary.dbAccessible ? 'text-green-600' : 'text-red-600'}>
                    {connectionStatus.summary.dbAccessible ? '✅ Accessible' : '❌ Failed'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>Ready for Tables</span>
                  <span className={connectionStatus.summary.readyForTables ? 'text-green-600' : 'text-red-600'}>
                    {connectionStatus.summary.readyForTables ? '✅ Ready' : '❌ Not Ready'}
                  </span>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <p className="text-blue-800">{connectionStatus.message}</p>
                </div>
              </div>
            ) : (
              <p className="text-red-600">Failed to check connection status</p>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-3">Next Steps:</h3>
            <ul className="text-yellow-800 space-y-2">
              <li>• If environment variables are invalid: Check your .env.local file</li>
              <li>• If connection fails: Verify your Supabase project URL and keys</li>
              <li>• If ready for tables: Run the SQL commands from SUPABASE_SETUP_GUIDE.md</li>
              <li>• Test the full integration at: <a href="/test-supabase" className="underline">/test-supabase</a></li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex space-x-4">
            <a
              href="/test-supabase"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Full Test Page
            </a>
            <a
              href="/api/test-supabase"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              target="_blank"
            >
              API Test (JSON)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 