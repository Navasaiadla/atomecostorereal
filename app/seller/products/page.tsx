"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Eye, Package } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  is_active: boolean
  created_at: string
  image_url?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setProducts([])
        setLoading(false)
        return
      }
      // Fetch categories map
      const { data: cats } = await supabase.from('categories').select('id, Category')
      const categoryIdToName = new Map<string, string>((cats || []).map((c: any) => [c.id, c.Category]))

      const { data, error } = await supabase
        .from('products')
        .select('id, title, description, price, stock, is_active, created_at, category_id, product_images ( image_path, is_main )')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Seller products error:', error)
        setProducts([])
      } else {
        setProducts((data || []).map(r => {
          const images = Array.isArray((r as any).product_images) ? (r as any).product_images : []
          const sorted = [...images].sort((a: any, b: any) => Number(b.is_main) - Number(a.is_main))
          const firstPath = sorted[0]?.image_path as string | undefined
          const toPublic = (p?: string) => p && (p.startsWith('http') || p.startsWith('/'))
            ? p
            : p
            ? supabase.storage.from('product-images').getPublicUrl(p).data.publicUrl
            : undefined
          const imageUrl = toPublic(firstPath)
          return ({
          id: r.id as string,
          name: (r as any).title as string,
          description: (r as any).description || '',
          price: (r as any).price as number,
          stock: (r as any).stock as number,
          category: categoryIdToName.get((r as any).category_id) || '—',
          is_active: (r as any).is_active as boolean,
          created_at: (r as any).created_at as string,
          image_url: imageUrl,
        })}))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleToggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, is_active: !p.is_active } : p
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product listings</p>
          </div>
        </div>
        <Link href="/seller/add-product">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Inventory
          </CardTitle>
          <CardDescription>
            {products.length} product{products.length !== 1 ? 's' : ''} in your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first product</p>
              <Link href="/seller/add-product">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <img src={product.image_url || '/products/bamboo-utensils.svg'} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/products/bamboo-utensils.svg' }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">₹{product.price.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock}
                        </span>
                        {product.stock < 10 && (
                          <Badge variant="destructive" className="ml-2 text-xs">Low Stock</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={product.is_active ? "default" : "secondary"}
                          className={product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/seller/products/edit/${product.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(product.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
              <p className="text-sm text-gray-600">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Active Products</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {products.filter(p => p.stock < 10).length}
              </p>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 