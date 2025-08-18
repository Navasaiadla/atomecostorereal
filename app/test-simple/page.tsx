'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export default function TestSimplePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      console.log('🔍 API Response:', data)
      setProducts(data.products || [])
    } catch (error) {
      console.error('❌ Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Image Test</h1>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Image URL: {product.image}</p>
            
            <div className="mt-2">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-32 h-32 object-cover border"
                onError={(e) => {
                  console.log(`❌ Image failed: ${product.name}`, product.image)
                  const target = e.currentTarget as HTMLImageElement
                  target.style.border = '2px solid red'
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjY0IiB5PSI2NCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZDwvdGV4dD4KPC9zdmc+'
                }}
                onLoad={() => {
                  console.log(`✅ Image loaded: ${product.name}`, product.image)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
