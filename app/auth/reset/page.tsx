'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [stage, setStage] = useState<'verifying' | 'reset' | 'done' | 'error'>('verifying')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Supabase sends access token via hash; the SDK reads it and sets the session.
    const run = async () => {
      try {
        const supabase = createClient()
        // After redirect, Supabase SDK handles session automatically.
        setStage('reset')
      } catch {
        setStage('error')
        setMessage('Could not verify reset link')
      }
    }
    run()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setMessage(error.message)
      } else {
        setStage('done')
      }
    } catch {
      setMessage('Failed to update password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md">
        {stage === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <h1 className="text-xl font-bold">Set a new password</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="New password"
              minLength={6}
              required
            />
            <button className="w-full bg-[#2B5219] text-white rounded py-2">Update Password</button>
            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        )}
        {stage === 'done' && (
          <div className="text-center">
            <h1 className="text-xl font-bold mb-2">Password updated</h1>
            <p className="text-gray-600">You can now close this tab and log in.</p>
          </div>
        )}
        {stage === 'verifying' && <p>Verifying link…</p>}
        {stage === 'error' && <p className="text-red-600">{message || 'Link invalid or expired.'}</p>}
      </div>
    </div>
  )
}






