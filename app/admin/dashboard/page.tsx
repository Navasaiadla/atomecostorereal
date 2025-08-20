"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Store,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  Globe,
  Clock,
  Calendar
} from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DashboardStats {
  totalSellers: number
  pendingSellers: number
  totalProducts: number
  ordersToday: number
  ordersThisMonth: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  customer_id: string
}

interface TopProduct {
  id: string
  name: string
  price: number
  stock: number
  is_active: boolean
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentOrders(data.recentOrders)
          setTopProducts(data.topProducts)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Inline status without extra header to avoid double header */}
        <p className="text-gray-600">Loading dashboard data...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* Keep content area clean; top bar shows the page title */}
      <p className="sr-only">admin hub panel</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sellers"
          value={stats?.totalSellers || 0}
          icon={Store}
          description="Active and pending sellers"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingSellers || 0}
          icon={Users}
          description="Sellers awaiting approval"
          trend={{ value: 8.3, isPositive: false }}
        />
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          description="Products listed on platform"
          trend={{ value: 15.2, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          description="Total revenue from all orders"
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Orders Today"
          value={stats?.ordersToday || 0}
          icon={Clock}
          description="Orders placed today"
        />
        <StatCard
          title="Orders This Month"
          value={stats?.ordersThisMonth || 0}
          icon={Calendar}
          description="Orders placed this month"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(-6)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{order.total_amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                      <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No products available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Add New Product</span>
            </Button>
            <Link href="/admin/sellers">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <Store className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Review Seller Applications</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 w-full">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium">View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 