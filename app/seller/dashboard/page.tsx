"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Package,
  Clock,
  IndianRupee,
  TrendingUp,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

interface ProductRow {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  is_active: boolean
  created_at: string
}

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  inactiveProducts: number
  pendingOrders: number
  totalSalesThisMonth: number
  growthRatePct: number
}

interface RecentOrderRow {
  id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<ProductRow[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrderRow[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    inactiveProducts: 0,
    pendingOrders: 0,
    totalSalesThisMonth: 0,
    growthRatePct: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setProducts([])
          setStats({
            totalProducts: 0,
            activeProducts: 0,
            lowStockProducts: 0,
            inactiveProducts: 0,
            pendingOrders: 0,
            totalSalesThisMonth: 0,
            growthRatePct: 0,
          })
          return
        }

        const { data: rows, error } = await supabase
          .from('products')
          .select('id, title, description, price, stock, is_active, created_at')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Seller dashboard products error:', error)
          setProducts([])
        } else {
          const mapped: ProductRow[] = (rows || []).map(r => ({
            id: r.id as string,
            name: (r as any).title as string,
            description: (r as any).description ?? null,
            price: (r as any).price as number,
            stock: (r as any).stock as number,
            is_active: (r as any).is_active as boolean,
            created_at: (r as any).created_at as string,
          }))
          setProducts(mapped)

          const total = mapped.length
          const active = mapped.filter(p => p.is_active).length
          const lowStock = mapped.filter(p => p.is_active && (p.stock ?? 0) < 10).length
          const inactive = total - active
          setStats(prev => ({
            ...prev,
            totalProducts: total,
            activeProducts: active,
            lowStockProducts: lowStock,
            inactiveProducts: inactive,
          }))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const inventoryPieData = useMemo(
    () => [
      { name: "Active", value: stats.activeProducts, color: "#16a34a" },
      { name: "Low stock", value: stats.lowStockProducts, color: "#f59e0b" },
      { name: "Inactive", value: stats.inactiveProducts, color: "#ef4444" },
    ],
    [stats.activeProducts, stats.lowStockProducts, stats.inactiveProducts]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your store today</p>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-sm bg-green-100 text-green-800 px-3 py-2 rounded-md hover:bg-green-200">
          <span>View My Store</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Products Listed" value={stats.totalProducts} icon={<Package className="h-5 w-5 text-blue-600" />} accent="bg-blue-50" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<Clock className="h-5 w-5 text-amber-600" />} accent="bg-amber-50" />
        <StatCard title="Total Sales (This Month)" value={`₹${stats.totalSalesThisMonth.toLocaleString()}`} icon={<IndianRupee className="h-5 w-5 text-emerald-700" />} accent="bg-emerald-50" />
        <StatCard title="Growth Rate" value={`${stats.growthRatePct}%`} icon={<TrendingUp className="h-5 w-5 text-purple-600" />} accent="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <span className="text-sm text-gray-500">View All</span>
            </div>
          </div>
          <div className="p-5 space-y-5">
            {recentOrders.length === 0 ? (
              <EmptyState title="No orders yet" description="Orders will appear here once customers start purchasing your products." />
            ) : (
              recentOrders.map((o) => (
                <OrderListItem
                  key={o.id}
                  code={o.id}
                  name={"Customer"}
                  amount={`₹${o.total_amount}`}
                  status={o.status}
                  statusColor={
                    o.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    o.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                    o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }
                />
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-4">
            <Link href="/seller/add-product">
              <Button className="w-full bg-green-600 hover:bg-green-700 h-12">
                ➕ Add New Product
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button variant="outline" className="w-full h-12">
                📦 Manage Products
              </Button>
            </Link>
            <Link href="/seller/orders">
              <Button variant="outline" className="w-full h-12">
                📋 View Orders
              </Button>
            </Link>
            <Link href="/seller/analytics">
              <Button variant="outline" className="w-full h-12">
                📈 Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Breakdown</h2>
            <p className="text-sm text-gray-500 mt-1">Active vs Low stock vs Inactive products</p>
          </div>
          <div className="p-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={inventoryPieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {inventoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Store Overview</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Store Status</p>
                <p className="text-sm text-gray-600">Your store is currently active</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Last Order</p>
                <p className="text-sm text-gray-600">No orders yet</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Total Revenue</p>
                <p className="text-sm text-gray-600">₹0 this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${accent}`}>{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

function OrderListItem({
  code,
  name,
  amount,
  status,
  statusColor,
}: {
  code: string
  name: string
  amount: string
  status: string
  statusColor: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900">{code}</p>
        <p className="text-xs text-gray-500">{name}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-800 font-semibold">{amount}</span>
        <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>{status}</span>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
}) {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">🎯</div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      {actionHref && actionLabel ? (
        <div className="mt-4">
          <Link href={actionHref}>
            <Button className="bg-green-600 hover:bg-green-700">{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  )
} 