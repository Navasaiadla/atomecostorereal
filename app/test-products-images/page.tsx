'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  images: string[]
  category_id: string | null
  stock: number
}

export default function TestProductsImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Fetching products with images...')
      const response = await fetch('/api/products')
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ Products data:', data)
      setProducts(data.products || [])
    } catch (err) {
      console.error('❌ Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Products with Images</h1>
          
          <div className="space-y-6">
            {/* Test Button */}
            <div className="p-4 rounded-lg border bg-white">
              <h2 className="text-lg font-semibold mb-2">API Test</h2>
              <button 
                onClick={fetchProducts}
                className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-4 py-2 rounded-lg"
              >
                Refresh Products
              </button>
            </div>

            {/* Status */}
            <div className="p-4 rounded-lg border bg-white">
              <h2 className="text-lg font-semibold mb-2">Status</h2>
              {loading ? (
                <div className="text-blue-600">🔄 Loading...</div>
              ) : error ? (
                <div className="text-red-600">❌ Error: {error}</div>
              ) : (
                <div className="text-green-600">✅ Products loaded! Found {products.length} products</div>
              )}
            </div>

            {/* Products Grid */}
            {products.length > 0 && (
              <div className="p-4 rounded-lg border bg-white">
                <h2 className="text-lg font-semibold mb-4">Products with Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="mb-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            console.log(`❌ Image failed to load for ${product.title}:`, product.images[0])
                            e.currentTarget.src = '/bamboo-utensils.svg'
                          }}
                          onLoad={() => {
                            console.log(`✅ Image loaded successfully for ${product.title}:`, product.images[0])
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <p className="font-bold text-[#2B5219]">₹{product.price}</p>
                        <p className="text-sm text-gray-500">Category: {product.category_id}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        <p className="text-xs text-gray-400 break-all">Image URL: {product.images[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Data */}
            <div className="p-4 rounded-lg border bg-white">
              <h2 className="text-lg font-semibold mb-2">Raw API Response</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify({ products, loading, error }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
