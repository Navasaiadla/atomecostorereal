'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

interface User {
  id: string
  email: string
  user_metadata?: {
    role?: string
    full_name?: string | null
  }
}

export default function SellHerePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user as unknown as User | null)
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  // If already a seller per profiles table, redirect directly to dashboard
  useEffect(() => {
    const redirectIfSeller = async () => {
      if (!user) return
      try {
        const supabase = createClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile?.role === 'seller') {
          window.location.replace('/seller/dashboard')
        }
      } catch (err) {
        // ignore
      }
    }
    redirectIfSeller()
  }, [user])

  const handleRegisterAsSeller = async () => {
    if (!user) {
      // Redirect to login if not logged in
      window.location.href = '/login?next=/sell-here'
      return
    }

    setIsRegistering(true)
    try {
      const supabase = createClient()
      
      // Update user metadata to set role as seller
      const { error } = await supabase.auth.updateUser({
        data: { role: 'seller' }
      })

      if (error) {
        console.error('Error updating user role:', error)
        alert('Failed to register as seller. Please try again.')
      }

      // Ensure profiles table reflects seller role (middleware checks this)
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null,
            role: 'seller',
          })
      } catch (profileErr) {
        console.error('Error upserting profile role:', profileErr)
      }

      // Redirect to seller dashboard
      window.location.href = '/seller/dashboard'
    } catch (error) {
      console.error('Error registering as seller:', error)
      alert('Failed to register as seller. Please try again.')
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sell on Atom Eco Store</h1>
              <p className="text-gray-600 mt-2">Start selling your eco-friendly products</p>
            </div>
            <Link href="/" className="text-green-600 hover:text-green-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!user ? (
          /* Not logged in */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Seller Community</h2>
              <p className="text-gray-600 mb-8">
                Start selling your eco-friendly products to customers who care about sustainability. 
                Join thousands of sellers who are making a difference.
              </p>
              <div className="space-y-4">
                <Link href="/register?next=/sell-here">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                    Create Account & Start Selling
                  </Button>
                </Link>
                <p className="text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link href="/login?next=/sell-here" className="text-green-600 hover:text-green-700">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Logged in but not a seller */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Seller</h2>
                <p className="text-gray-600">
                  Welcome back, {user.email}! Ready to start selling your eco-friendly products?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Why Sell With Us?</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Reach customers who care about sustainability</li>
                    <li>• Easy-to-use dashboard to manage your products</li>
                    <li>• Competitive commission rates</li>
                    <li>• Dedicated support for sellers</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleRegisterAsSeller}
                  disabled={isRegistering}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                >
                  {isRegistering ? 'Registering...' : 'Register as Seller'}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By registering as a seller, you agree to our{' '}
                  <Link href="/terms" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
