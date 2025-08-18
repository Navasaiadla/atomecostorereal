'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { useState, useEffect } from 'react'

export default function DebugRolePage() {
  const { user, loading } = useAuth()
  const [profileData, setProfileData] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!user) return
    
    setLoadingProfile(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/get-profile')
      const data = await response.json()
      
      if (response.ok) {
        setProfileData(data.profile)
      } else {
        setError(data.error || 'Failed to fetch profile')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoadingProfile(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Logged In</h1>
          <p className="text-gray-600">Please log in to view debug information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Role Debug Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                  <p className="mt-1 text-sm text-gray-900">{user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              {loadingProfile ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading profile...</p>
                </div>
              ) : error ? (
                <div className="text-red-600">
                  <p className="text-sm font-medium">Error: {error}</p>
                </div>
              ) : profileData ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      profileData.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : profileData.role === 'seller'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profileData.role?.charAt(0).toUpperCase() + profileData.role?.slice(1) || 'Customer'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{profileData.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profile Created</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.created_at ? new Date(profileData.created_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No profile data found</p>
              )}
            </div>
          </div>

          {/* Expected Redirect */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Expected Redirect</h3>
            {profileData?.role === 'admin' ? (
              <p className="text-blue-800">
                <strong>Admin user detected!</strong> You should be redirected to <code className="bg-blue-100 px-1 rounded">/admin/dashboard</code>
              </p>
            ) : profileData?.role === 'seller' ? (
              <p className="text-blue-800">
                <strong>Seller user detected!</strong> You should be redirected to <code className="bg-blue-100 px-1 rounded">/seller/dashboard</code>
              </p>
            ) : (
              <p className="text-blue-800">
                <strong>Customer user detected!</strong> You should be redirected to <code className="bg-blue-100 px-1 rounded">/</code> (home page)
              </p>
            )}
          </div>

          {/* Debug Actions */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={fetchProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Refresh Profile
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reload Page
            </button>
          </div>

          {/* Raw Data */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Raw Profile Data</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 