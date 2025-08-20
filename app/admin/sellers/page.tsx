"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, CheckCircle, Store, Users, XCircle } from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'
import { SellerTable } from '@/components/admin/seller-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Seller {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

interface SellerCounts {
  total: number
  pending: number
  approved: number
  rejected: number
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [counts, setCounts] = useState<SellerCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSellers()
  }, [])

  async function fetchSellers() {
    try {
      const response = await fetch('/api/admin/sellers')
      if (response.ok) {
        const data = await response.json()
        setSellers(data.sellers)
        setCounts(data.counts)
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSellerUpdate(sellerId: string, newRole: string) {
    try {
      const response = await fetch('/api/admin/sellers/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sellerId, newRole }),
      })

      if (response.ok) {
        // Refresh the sellers list
        await fetchSellers()
      } else {
        throw new Error('Failed to update seller')
      }
    } catch (error) {
      console.error('Error updating seller:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <p className="text-gray-600 mt-2">Loading sellers data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-xs border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <p className="text-gray-600 mt-2">Manage all sellers on the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Review Applications</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Add New Seller</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Sellers"
          value={counts.total}
          icon={Store}
          description="All sellers on platform"
        />
        <StatCard
          title="Approved"
          value={counts.approved}
          icon={CheckCircle}
          description="Active sellers"
        />
        <StatCard
          title="Pending"
          value={counts.pending}
          icon={Users}
          description="Awaiting approval"
        />
        <StatCard
          title="Rejected"
          value={counts.rejected}
          icon={XCircle}
          description="Rejected applications"
        />
      </div>

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Sellers List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sellers.length > 0 ? (
            <SellerTable 
              sellers={sellers} 
              onSellerUpdate={handleSellerUpdate}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No sellers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 