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
  const { signInWithPassword, signUpWithPassword, isSupabaseAvailable } = useAuth()
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

      {/* Demo social buttons */}
      <div className="mt-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-500">or continue with</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50">
            <span className="inline-flex h-5 w-5 bg-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.9 3.3 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c6.3 0 9.1-4.4 9.1-8.3 0-.6-.1-1-.2-1.5H12z"/></svg>
            </span>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50">
            <span className="inline-flex h-5 w-5 bg-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#1877F2" d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24H12.82v-9.294H9.692V11.07h3.128V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.794.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.767v2.318h3.587l-.467 3.636h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/></svg>
            </span>
            <span className="text-sm font-medium text-gray-700">Facebook</span>
          </button>
        </div>
        <p className="mt-2 text-[11px] text-gray-500 text-center">Demo only</p>
      </div>

      {message && (
        <div className={`mt-3 text-center text-xs px-3 py-2 rounded border ${messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {message}
        </div>
      )}

      <div className="mt-8 text-center">
        {mode === 'signin' ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => { setMode('signup'); resetForm() }}
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Sign up here
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => { setMode('signin'); resetForm() }}
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </div>
  )
} 