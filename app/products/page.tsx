'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { ProductsGrid } from './products-grid'

// Default categories for fallback
const defaultCategories = [
  { id: 'all', name: 'All', icon: '🌱' },
  { id: 'home-living', name: 'Home', icon: '🏠' },
  { id: 'personal-care', name: 'Care', icon: '🧴' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍽️' },
  { id: 'clothes', name: 'Clothes', icon: '👕' }
]

export default function ProductsPage() {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-2 sm:px-4 pt-6 pb-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            Sustainable Products
          </h1>
          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Discover our carefully curated collection of eco-friendly products that make a difference
          </p>
        </div>

        {/* Products Grid */}
        <Suspense>
          <ProductsGrid />
        </Suspense>
      </div>
    </div>
  )
} 