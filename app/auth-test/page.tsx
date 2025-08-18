'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { UserMenu } from '@/components/auth/user-menu'
import Link from 'next/link'

export default function AuthTestPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Authentication Test
            </h1>
            <UserMenu />
          </div>

          {user ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-4">
                  ✅ Successfully Authenticated!
                </h2>
                <div className="space-y-2">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Email Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                  <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Authentication Features Working:
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>✅ Email-only sign in with magic links</li>
                  <li>✅ User session management</li>
                  <li>✅ Automatic profile creation</li>
                  <li>✅ Sign out functionality</li>
                  <li>✅ Real-time auth state updates</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                  Next Steps:
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Add UserMenu to your header component</li>
                  <li>• Use AuthGuard to protect routes</li>
                  <li>• Integrate with your e-commerce features</li>
                  <li>• Test cart and order functionality</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-900 mb-4">
                  ❌ Not Authenticated
                </h2>
                <p className="text-red-800 mb-4">
                  You need to sign in to access this page.
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </Link>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Test:
                </h3>
                <ol className="space-y-2 text-gray-700">
                  <li>1. Click "Go to Login" above</li>
                  <li>2. Enter your email address</li>
                  <li>3. Check your email for the magic link</li>
                  <li>4. Click the magic link to sign in</li>
                  <li>5. You'll be redirected back here</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 