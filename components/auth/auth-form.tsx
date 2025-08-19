'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from './auth-provider'

type AuthMode = 'signin' | 'signup'

interface AuthFormProps {
  initialMode?: AuthMode
}

export default function AuthForm({ initialMode = 'signin' }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const { signInWithPassword, signUpWithPassword, signInWithOAuth, isSupabaseAvailable } = useAuth()
  const [resetSent, setResetSent] = useState(false)

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    if (!email || !password) {
      setMessage('Please enter both email and password')
      setLoading(false)
      return
    }

    try {
      let error
      if (mode === 'signup') {
        const fullName = `${firstName} ${lastName}`.trim()
        const { error: signUpError } = await signUpWithPassword(email, password, fullName)
        error = signUpError
      } else {
        const { error: signInError } = await signInWithPassword(email, password)
        error = signInError
      }
      
      if (error) {
        setMessageType('error')
        setMessage(error.message || 'Invalid email or password')
      } else {
        setMessageType('success')
        setMessage(mode === 'signup' ? 'Account created. Check your email to verify.' : 'Login successful')
        setEmail('')
        setPassword('')
        setFirstName('')
        setLastName('')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFirstName('')
    setLastName('')
    setMessage('')
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessageType('error')
      setMessage('Enter your email to receive a reset link')
      return
    }
    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) {
        setMessageType('error')
        setMessage(error.message)
      }
      else {
        setResetSent(true)
        setMessageType('success')
        setMessage('Reset email sent. Check your inbox to set a new password.')
      }
    } catch {
      setMessageType('error')
      setMessage('Could not send reset link. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseAvailable) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            ⚠️ Configuration Required
          </h2>
          <p className="text-gray-600">
            Supabase is not configured. Please check your environment variables.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Secondary header removed as requested */}

        {/* Auth Mode Toggle */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => { setMode('signin'); resetForm() }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signin' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => { setMode('signup'); resetForm() }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signup' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Password Form */}
      <form onSubmit={handlePasswordAuth} className="space-y-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required={mode === 'signup'}
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading}
                required={mode === 'signup'}
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email-password" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email-password"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {mode === 'signin' && (
          <div className="text-right -mt-2">
            <button type="button" className="text-xs text-green-700 hover:underline" onClick={handleForgotPassword} disabled={loading}>
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === 'signup' ? 'Creating account...' : 'Logging in...'}
            </div>
          ) : (
            mode === 'signup' ? 'Create Account' : 'Login'
          )}
        </button>
      </form>

      {/* Social login */}
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-500">or continue with</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => signInWithOAuth('google')}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <span className="inline-flex h-5 w-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.731 31.668 29.312 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.957 3.043l5.657-5.657C33.94 5.046 29.189 3 24 3 12.955 3 4 11.955 4 23s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.52 16.104 18.86 13 24 13c3.059 0 5.842 1.156 7.957 3.043l5.657-5.657C33.94 5.046 29.189 3 24 3 16.318 3 9.656 7.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 43c5.243 0 10.047-2.007 13.657-5.271l-6.29-5.309C29.318 33.46 26.774 35 24 35c-5.281 0-9.688-3.366-11.303-8.001l-6.54 5.036C9.43 38.556 16.186 43 24 43z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.048 3.034-3.235 5.5-5.936 7.084l.001-.001 6.29 5.309C33.52 42.119 39 38 39 23c0-1.341-.138-2.651-.389-3.917z"/>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`mt-3 text-center text-xs px-3 py-2 rounded border ${messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {message}
        </div>
      )}

      {/* Removed external signup/login links below card as requested */}
    </div>
  )
} 