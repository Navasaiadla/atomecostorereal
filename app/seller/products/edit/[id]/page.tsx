"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Upload, X } from "lucide-react"

interface Category { id: string; Category: string }

export default function SellerEditProductPage() {
  const params = useParams()
  const productId = params.id as string
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [stock, setStock] = useState<number>(0)
  const [categoryId, setCategoryId] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setError(null)
        // Load categories
        const { data: cats } = await supabase.from('categories').select('id, Category').order('Category', { ascending: true })
        setCategories(cats || [])

        // Load product
        let { data, error } = await supabase
          .from('products')
          .select('id, title, description, price, stock, is_active, category_id, product_images ( image_path, is_main )')
          .eq('id', productId)
          .single()
        // Fallback: use server API if direct read fails
        if (error || !data) {
          const res = await fetch(`/api/products/${productId}`, { cache: 'no-store' })
          if (!res.ok) throw new Error('Failed to load product')
          const payload = await res.json()
          const p = payload.product
          setTitle(p?.name || '')
          setDescription(p?.description || '')
          setPrice(p?.price || 0)
          setStock(p?.stockQuantity || 0)
          setCategoryId('')
          setIsActive(true)
          setImages(Array.isArray(p?.images) ? p.images : [])
        } else {
          setTitle((data as any).title || '')
          setDescription((data as any).description || '')
          setPrice((data as any).price || 0)
          setStock((data as any).stock || 0)
          setCategoryId((data as any).category_id || '')
          setIsActive((data as any).is_active ?? true)
          const imgs = Array.isArray((data as any).product_images) ? (data as any).product_images : []
          const toPublic = (p: string) => p?.startsWith('http') || p?.startsWith('/')
            ? p
            : supabase.storage.from('product-images').getPublicUrl(p).data.publicUrl
          setImages(imgs.sort((a: any, b: any) => Number(b.is_main) - Number(a.is_main)).map((i: any) => toPublic(i.image_path)))
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    })()
  }, [productId, supabase])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({ title, description, price, stock, is_active: isActive, category_id: categoryId })
        .eq('id', productId)
      if (error) throw error
      alert('Product updated')
      router.push('/seller/products')
    } catch (e) {
      alert('Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      alert('Product deleted')
      router.push('/seller/products')
    } catch (e) {
      alert('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const handleChooseFiles = () => fileInputRef.current?.click()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.type.split('/')[1] || 'jpg'
      const path = `${productId}/${Date.now()}_${i}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false })
      if (!error) {
        await supabase.from('product_images').insert({ product_id: productId, image_path: path, is_main: images.length === 0 && i === 0 })
        const url = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
        setImages(prev => [...prev, url])
      }
    }
  }

  const removeImage = async (idx: number) => {
    const url = images[idx]
    if (!confirm('Remove this image?')) return
    setImages(prev => prev.filter((_, i) => i !== idx))
    // Optional: best effort remove row by matching path suffix
    const path = url.replace(/^https?:\/\/[^/]+\//, '').replace(/^.*product-images\//, '')
    await supabase.from('product_images').delete().eq('product_id', productId).eq('image_path', path)
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="flex items-center gap-4">
        <Link href="/seller/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product details and images</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Make your changes and click Save</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                <option value="">Select a category</option>
                {categories.map(c => (<option key={c.id} value={c.id}>{c.Category}</option>))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" min={0} value={stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Active</Label>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <span className="text-sm text-gray-700">Is Active</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative h-24 rounded-lg overflow-hidden border">
                  <img src={img} alt={`Image ${idx+1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <input ref={fileInputRef} onChange={handleFileSelect} type="file" accept="image/*" multiple className="hidden" />
            <Button type="button" variant="outline" onClick={handleChooseFiles} className="inline-flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload Images
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>Save Changes</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>Delete Product</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
