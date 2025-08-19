"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/auth/auth-provider'

interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
}

interface ReviewsProps {
  productId: string
  productName: string
}

export function Reviews({ productId, productName }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  // Realtime updates for reviews on this product
  useEffect(() => {
    let channel: any = null
    const setupRealtime = async () => {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        channel = supabase
          .channel(`reviews:${productId}`)
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'reviews', filter: `product_id=eq.${productId}` },
            () => fetchReviews()
          )
          .subscribe()
      } catch (error) {
        console.error('Error setting up realtime:', error)
      }
    }
    setupRealtime()
    return () => {
      if (!channel) return
      (async () => {
        try {
          const { createClient } = await import('@/lib/supabase')
          const supabase = createClient()
          supabase.removeChannel(channel)
        } catch {}
      })()
    }
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()
      if (response.ok) {
        const list: Review[] = data.reviews || []
        setReviews(list as any)
        if (user) {
          const mine = list.find((r) => r.user_id === user.id) || null
          setUserReview(mine)
          if (mine) setFormData({ rating: mine.rating, comment: mine.comment ?? '' })
        } else {
          setUserReview(null)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }
    try {
      setSubmitting(true)
      const url = userReview ? `/api/reviews/${userReview.id}` : '/api/reviews'
      const method = userReview ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating: formData.rating, comment: formData.comment })
      })
      const data = await response.json()
      if (response.ok) {
        setUserReview(data.review)
        setShowReviewForm(false)
        if (!userReview) setFormData({ rating: 5, comment: '' })
        await fetchReviews()
      } else {
        alert(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!userReview) return
    if (!confirm('Are you sure you want to delete your review?')) return
    try {
      const response = await fetch(`/api/reviews/${userReview.id}`, { method: 'DELETE' })
      if (response.ok) {
        setUserReview(null)
        setFormData({ rating: 5, comment: '' })
        await fetchReviews()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete review')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0
  const hasReviews = reviews.length > 0

  const renderGlobes = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => {
      const active = i < rating
      return (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
          className={`focus:outline-none ${interactive ? 'hover:scale-110 transition-transform' : ''}`}
          aria-label={`Rate ${i + 1} out of 5`}
        >
          <Image
            src="/globe%20with%20no%20background.png"
            alt="globe"
            width={28}
            height={28}
            className={(active ? 'opacity-100' : 'opacity-35') + ' select-none'}
            priority={false}
          />
        </button>
      )
    })
  }

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Customer Reviews</h3>
          {hasReviews ? (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center scale-90 sm:scale-100 origin-left">
                {renderGlobes(Math.round(averageRating))}
              </div>
              <span className="text-[10px] sm:text-xs text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          ) : (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">No reviews yet</p>
          )}
        </div>

        <div>
          <Button
            onClick={() => {
              if (!user) {
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
                return
              }
              setShowReviewForm(true)
            }}
            className="bg-[#2B5219] hover:bg-[#1a3110] text-xs sm:text-sm w-full sm:w-auto h-10 rounded-md px-4"
          >
            {userReview ? 'Edit Review' : 'Write a Review'}
          </Button>
        </div>
      </div>

      {showReviewForm && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border">
          <h4 className="text-lg font-semibold mb-4">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {renderGlobes(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}
                <span className="ml-2 text-sm text-gray-600">{formData.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
              <Textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={1000}
              />
            </div>

            <div className="flex gap-2 sm:gap-3 flex-wrap">
              <Button type="submit" disabled={submitting} className="bg-[#2B5219] hover:bg-[#1a3110] text-sm">
                {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
              {userReview && (
                <Button type="button" variant="outline" onClick={handleDeleteReview} className="text-red-600 hover:text-red-700">
                  Delete Review
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {userReview && !showReviewForm && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-800">Your Review</h4>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {renderGlobes(userReview.rating)}
            <span className="text-sm text-gray-600">{userReview.rating}/5</span>
          </div>
          {userReview.comment && <p className="text-sm text-green-700">{userReview.comment}</p>}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B5219] mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderGlobes(review.rating)}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">{review.rating}/5</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              {review.comment && <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>}
              <div className="mt-2"><span className="text-xs text-gray-500">by {review.reviewer_name || 'Anonymous'}</span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  )
}
