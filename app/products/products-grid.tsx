'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
// Product shape returned by /api/products
interface GridProduct {
  id: string
  title: string
  description: string | null
  price: number
  sale_price: number | null
  images: string[]
  category_id: string | null
  seller_id: string
  stock: number
  is_active: boolean
  created_at: string
}

interface Category {
  id: string
  name: string
  description: string | null
  image: string
}

export function ProductsGrid() {
  const [products, setProducts] = useState<GridProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Listing page is browse-only; actions live on product detail page
  const { addToCart, error: cartError, successMessage, clearError, clearSuccess } = useCart()

  useEffect(() => {
    // If a category is provided via URL, respect it on mount
    try {
      const url = new URL(window.location.href)
      const initialCat = url.searchParams.get('category')
      if (initialCat && selectedCategory === 'all') {
        setSelectedCategory(initialCat)
        return
      }
    } catch {}
    fetchProducts()
    fetchCategories()
  }, [selectedCategory])

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

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      const list: GridProduct[] = data.products || []
      setProducts(list)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('📂 Fetched categories from API:', data.categories)
        setCategories(data.categories || [])
      } else {
        console.error('❌ Failed to fetch categories:', response.status)
        setCategories([])
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err)
      setCategories([])
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: string } = {
      'All': '🌱',
      'Clothes': '👕',
      'Home and Clean': '🏠',
      'Bags and Accessories': '👜',
      'Kitchen': '🍽️',
      'Personal Care': '🧴',
      'Bathroom': '🛁',
      'Office': '📝',
      'Garden': '🌿',
      'Baby': '👶'
    }
    
    // Try exact match first
    if (icons[categoryName]) {
      return icons[categoryName]
    }
    
    // Try partial match
    for (const [key, icon] of Object.entries(icons)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon
      }
    }
    
    return '🌱' // Default icon
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Category Filter Skeleton */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-2 md:gap-3 pb-2 md:pb-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-24 h-10 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <Button onClick={fetchProducts} className="bg-[#2B5219] hover:bg-[#1a3110]">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Cart Messages */}
      {cartError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{cartError}</span>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800">{successMessage}</span>
            </div>
            <button onClick={clearSuccess} className="text-green-400 hover:text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6 md:mb-12">
        <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-2 md:gap-3 pb-2 md:pb-0 -mx-2 px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 rounded-full border transition-all duration-300 transform hover:scale-105 whitespace-nowrap shrink-0 ${
                selectedCategory === category.id
                  ? 'border-[#2B5219] bg-[#2B5219] text-white'
                  : 'border-gray-200 hover:border-[#2B5219] hover:bg-[#2B5219] hover:text-white'
              }`}
            >
              <span className="text-base md:text-lg">{getCategoryIcon(category.name)}</span>
              <span className="font-medium text-xs md:text-sm lg:text-base">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-semibold">No products found</p>
            <p className="text-sm">Try selecting a different category</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
              {/* Product Image */}
              <div className="relative h-36 sm:h-48 bg-gray-100">
                <img
                  src={product.images?.[0] || '/products/bamboo-utensils.svg'}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/products/bamboo-utensils.svg'
                  }}
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <span className="inline-block bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Eco-Friendly</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base">{product.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                
                {/* Price and Earth Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base sm:text-xl font-bold text-[#2B5219]">₹{product.price}</span>
                    {product.sale_price && product.sale_price < product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.sale_price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-full">
                    <img src="/globe with no background.png" alt="Earth" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[10px] md:text-xs font-medium text-gray-700">Earth rating 4.5</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
