'use client'

import { useState } from 'react'
import { useAuth } from './auth-provider'

export default function EmailSignInForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!email) {
      setMessage('Please enter your email address')
      setIsSuccess(false)
      setLoading(false)
      return
    }

    try {
      const { error } = await signIn(email)
      
      if (error) {
        setMessage(error.message)
        setIsSuccess(false)
      } else {
        setMessage('Check your email for the magic link!')
        setIsSuccess(true)
        setEmail('')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to AtomecoStore
          </h2>
          <p className="text-gray-600">
            Enter your email to receive a magic link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              isSuccess 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending magic link...
              </div>
            ) : (
              'Send Magic Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <span className="text-blue-600 font-medium">
              Just enter your email above
            </span>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            How it works:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enter your email address</li>
            <li>• Check your inbox for a magic link</li>
            <li>• Click the link to sign in instantly</li>
            <li>• No password required!</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 