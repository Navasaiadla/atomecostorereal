'use client'

import AuthForm from '@/components/auth/auth-form'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { user, role } = useAuth()

  // If already signed in, leave login page immediately
  useEffect(() => {
    if (!user) return
    const url = new URL(window.location.href)
    const nextParam = url.searchParams.get('next')
    if (nextParam) {
      router.replace(nextParam)
      return
    }
    router.replace(role === 'admin' ? '/admin/dashboard' : '/')
  }, [user, role, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-6">
        {/* Inline logo above card */}
        <div className="flex justify-center">
          <Image src="/logo2.png" alt="Atom Eco Store" width={180} height={60} className="h-16 w-auto" />
        </div>
        {/* Heading removed as requested */}
        
        <AuthForm initialMode="signin" />
        
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-green-600 hover:text-green-500">
              Sign up here
            </a>
          </p>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500 mb-2">Or</p>
            <a 
              href="/products" 
              className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Continue without account (view products only)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 