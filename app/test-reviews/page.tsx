'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'

interface Review {
  id: string
  product_id: string
  customer_id: string
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  created_at: string
  updated_at: string
  profiles: {
    full_name: string | null
    email: string
  } | null
}

export default function TestReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [testProductId] = useState('test-product-123') // Use a test product ID

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?productId=${testProductId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
      } else {
        console.error('Error fetching reviews:', data.error)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const testCreateReview = async () => {
    if (!user) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: testProductId,
          rating: 5,
          title: 'Test Review',
          comment: 'This is a test review for the reviews system.'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Review created successfully!')
        await fetchReviews()
      } else {
        alert(data.error || 'Failed to create review')
      }
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Failed to create review')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Reviews System Test</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Information</h2>
            <div className="space-y-2">
              <p><strong>Test Product ID:</strong> {testProductId}</p>
              <p><strong>User Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}</p>
              <p><strong>Total Reviews:</strong> {reviews.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <Button
                onClick={testCreateReview}
                disabled={!user}
                className="bg-[#2B5219] hover:bg-[#1a3110]"
              >
                {user ? 'Create Test Review' : 'Login to Create Review'}
              </Button>
              
              <Button
                onClick={fetchReviews}
                variant="outline"
              >
                Refresh Reviews
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews List</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5219] mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.is_verified_purchase && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified Purchase
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {review.title && (
                      <h5 className="font-medium text-gray-900 mb-1">{review.title}</h5>
                    )}
                    
                    {review.comment && (
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    )}
                    
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        by {review.profiles?.full_name || review.profiles?.email || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet for this test product.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}































