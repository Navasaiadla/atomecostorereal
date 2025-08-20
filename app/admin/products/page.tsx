"use client"

import { useEffect, useState } from 'react'
import { Package, Plus, Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

interface Product {
  id: string
  name: string | null
  description: string | null
  price: number | null
  sale_price: number | null
  stock: number | null
  is_active: boolean | null
  seller_id: string | null
  created_at: string
  updated_at: string
}

interface ProductStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalInventoryValue: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    totalInventoryValue: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setError(null)
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        console.log('Products data:', data) // Debug log
        setProducts(data.products || [])
        setStats(data.stats || {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          totalInventoryValue: 0
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to fetch products:', response.status, errorData)
        setError(`Failed to fetch products: ${response.status} ${errorData.error || ''}`)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Loading products data...</p>
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
        <Button onClick={fetchProducts} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">View and manage all products on the platform</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="All products on platform"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={TrendingUp}
          description="Currently active products"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon={TrendingDown}
          description="Products with low stock"
        />
        <StatCard
          title="Total Value"
          value={`₹${stats.totalInventoryValue.toLocaleString()}`}
          icon={Package}
          description="Total inventory value"
        />
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products List ({products.length} products)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name || 'Unnamed Product'}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description || 'No description'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₹{product.price || 0}</div>
                          {product.sale_price && (
                            <div className="text-sm text-green-600">
                              Sale: ₹{product.sale_price}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${
                          (product.stock || 0) < 10 ? 'text-red-600' : 
                          (product.stock || 0) < 50 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {product.stock || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={(product.is_active ?? false) ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {(product.is_active ?? false) ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {product.seller_id ? product.seller_id.slice(0, 8) + '...' : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No products found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 