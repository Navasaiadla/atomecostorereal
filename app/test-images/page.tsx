'use client'

import { useState, useEffect } from 'react'

export default function TestImagesPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testProductsAPI()
  }, [])

  const testProductsAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Testing products API with images...')
      const response = await fetch('/api/products')
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('✅ API Response:', data)
      setProducts(data.products || [])
    } catch (err) {
      console.error('❌ Error testing products API:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (<div>Test Images</div>)
}
