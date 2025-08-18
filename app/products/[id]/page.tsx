'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Reviews } from '@/components/ui/reviews'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/components/auth/auth-provider'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  originalPrice: number | null
  rating: number
  reviews: number
  category: string
  categoryId?: string
  image: string
  images: string[]
  tag: string
  discount: number
  stockQuantity: number
}

interface RelatedProduct {
  id: string
  title: string
  description: string | null
  price: number
  images: string[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart, error: cartError, successMessage, clearError, clearSuccess } = useCart()
  const [activeIndex, setActiveIndex] = useState(0)
  const { user } = useAuth()
  const [related, setRelated] = useState<RelatedProduct[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [relatedError, setRelatedError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  useEffect(() => {
    if (!product) return
    const controller = new AbortController()
    const currentProduct = product
    async function fetchRelated(prod: Product) {
      try {
        setRelatedError(null)
        setRelatedLoading(true)
        const params = new URLSearchParams()
        if (prod.categoryId) params.set('category', prod.categoryId)
        params.set('limit', '8')
        const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error('Failed to fetch related products')
        const data = await res.json()
        const items: RelatedProduct[] = (data.products || []).filter((p: any) => p.id !== prod.id)
        setRelated(items)
      } catch (e) {
        if ((e as any)?.name === 'AbortError') return
        setRelatedError('Could not load related products')
      } finally {
        setRelatedLoading(false)
      }
    }
    fetchRelated(currentProduct)
    return () => controller.abort()
  }, [product])

  // Auto-clear cart messages after 3 seconds
  useEffect(() => {
    if (cartError || successMessage) {
      const timer = setTimeout(() => {
        if (cartError) clearError()
        if (successMessage) clearSuccess()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [cartError, successMessage, clearError, clearSuccess])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${productId}`)
      if (!response.ok) {
        throw new Error('Product not found')
      }
      
      const data = await response.json()
      setProduct(data.product)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    const maxQty = product?.stockQuantity ?? 0
    if (newQuantity >= 1 && newQuantity <= maxQty) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    if (!user) {
      router.push(`/login?next=/products/${productId}`)
      return
    }
    
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    const target = `/checkout?productId=${product.id}&qty=${quantity}`
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(target)}`)
      return
    }
    router.push(target)
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-96 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
              <Link href="/products" className="inline-block bg-[#2B5219] text-white px-6 py-3 rounded-lg hover:bg-[#1a3110] transition-colors">
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#2B5219]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#2B5219]">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images (Gallery) */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-96 lg:h-[500px]">
                  <img
                    src={(product.images?.[activeIndex] ?? product.image) || '/bamboo-utensils.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/bamboo-utensils.svg'
                    }}
                  />
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.images.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-20 rounded-lg overflow-hidden border ${
                        activeIndex === idx ? 'border-[#2B5219]' : 'border-gray-200'
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={img || '/bamboo-utensils.svg'}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/bamboo-utensils.svg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Tag */}
              <div>
                <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                  {product.tag}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* Earth Rating and Impact */}
              <div className="flex items-center gap-2">
                <img src="/globe with no background.png" alt="Earth" className="w-5 h-5" />
                <span className="text-gray-800 font-medium">Earth rating {Math.round(product.rating * 10) / 10}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
                <span className="ml-2 text-gray-400" title="Estimated environmental impact for large-scale adoption">i</span>
              </div>

              {/* Price (show total for selected quantity) */}
              <div className="flex items-center gap-3">
                <span className="text-3xl lg:text-4xl font-bold text-[#2B5219]">₹{product.price * quantity}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Stock visibility removed as requested */}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-[#2B5219] disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-[#2B5219] disabled:opacity-50"
                    disabled={false}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-12 bg-[#2B5219] hover:bg-[#1a3110] text-white text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.stockQuantity === 0 || addingToCart}
                  onClick={handleAddToCart}
                >
                  {addingToCart ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Adding...
                    </div>
                  ) : (
                    product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'
                  )}
                </Button>
                <Button
                  className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>

              {/* Category */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {product.category}
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related products</h2>
            {relatedLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow p-4 animate-pulse h-56" />
                ))}
              </div>
            ) : relatedError ? (
              <p className="text-sm text-gray-500">{relatedError}</p>
            ) : related.length === 0 ? (
              <p className="text-sm text-gray-500">No related products found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.slice(0, 8).map((rp) => (
                  <Link key={rp.id} href={`/products/${rp.id}`} className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden">
                    <div className="relative h-36 bg-gray-100">
                      <img
                        src={rp.images?.[0] || '/bamboo-utensils.svg'}
                        alt={rp.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src = '/bamboo-utensils.svg'
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Eco-Friendly</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.25rem]">{rp.title}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-bold text-[#2B5219]">₹{rp.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <Reviews productId={productId} productName={product.name} />
          </div>
        </div>
      </div>
    </div>
  )
} 