"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loading } from "@/components/ui/loading"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Temporarily bypass authentication check
    // TODO: Re-enable authentication when ready
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return <>{children}</>
}
