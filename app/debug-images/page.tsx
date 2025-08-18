'use client'

import { useState, useEffect } from 'react'

export default function DebugImagesPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDebugData()
  }, [])

  const fetchDebugData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Fetching debug data...')
      const response = await fetch('/api/debug-images')
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('✅ Debug data:', result)
      setData(result)
    } catch (err) {
      console.error('❌ Error fetching debug data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (<div>Debug Images</div>)
}
