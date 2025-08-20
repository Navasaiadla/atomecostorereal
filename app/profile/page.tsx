'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProfileData {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      fetchProfile()
    }
  }, [user, loading, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/get-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
      } else {
        console.error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-green-600 to-green-700 px-6 py-8">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-green-600">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profile?.full_name || 'User Profile'}
                </h1>
                <p className="text-green-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile?.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      profile?.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : profile?.role === 'seller'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profile?.role ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : 'Customer'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Since</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile?.created_at 
                        ? new Date(profile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/orders')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View My Orders
                  </button>
                  
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => router.push('/admin/dashboard')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  
                  {profile?.role === 'seller' && (
                    <button
                      onClick={() => router.push('/seller/dashboard')}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Seller Dashboard
                    </button>
                  )}
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-xs text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 