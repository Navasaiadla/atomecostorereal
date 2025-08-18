'use client'

import { useEffect, useState } from 'react'

interface FlashProps {
  message: string
  variant?: 'success' | 'error' | 'info'
  durationMs?: number
}

export function Flash({ message, variant = 'info', durationMs = 4000 }: FlashProps) {
  const [visible, setVisible] = useState<boolean>(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), durationMs)
    return () => clearTimeout(t)
  }, [durationMs])
  if (!visible || !message) return null

  const color = variant === 'success'
    ? 'border-green-200 bg-green-50 text-green-800'
    : variant === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-gray-200 bg-gray-50 text-gray-700'

  return (
    <div className={`text-sm px-3 py-2 rounded-md border ${color}`}>{message}</div>
  )
}



