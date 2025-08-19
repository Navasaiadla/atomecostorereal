'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function SignOutPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working')
  const [message, setMessage] = useState<string>('Signing you out…')

  useEffect(() => {
    const run = async () => {
      try {
        const supabase = createClient()
        // Best effort: clear client session first
        await supabase.auth.signOut()
        // Clear server cookies
        try {
          await fetch('/api/auth/signout', { method: 'POST', cache: 'no-store' })
        } catch {}
        setStatus('done')
        setMessage('Signed out. Redirecting…')
        setTimeout(() => router.replace('/'), 600)
      } catch (e: any) {
        setStatus('error')
        setMessage(e?.message || 'Could not sign you out. Please try again.')
      }
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border rounded-xl shadow-sm p-6 w-full max-w-sm text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
          {status === 'working' ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : status === 'done' ? (
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-800 mb-3">{message}</p>
        {status === 'error' && (
          <div className="space-x-2">
            <button onClick={() => location.reload()} className="px-3 py-1.5 rounded-md bg-[#2B5219] text-white text-sm">Try again</button>
            <Link href="/" className="px-3 py-1.5 rounded-md border text-sm">Go home</Link>
          </div>
        )}
      </div>
    </div>
  )
}


