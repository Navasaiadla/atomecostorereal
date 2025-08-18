"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Package, Check, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  description: string
  image: string
}

interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  category_id: string
  images: string[]
  eco_features: string[]
  status: 'active' | 'draft'
}

const ecoFeatures = [
  "Organic",
  "Handmade",
  "Recycled",
  "Cruelty-Free",
  "Biodegradable",
  "Fair Trade",
  "Locally Sourced",
  "Zero Waste"
]

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: "",
    images: [],
    eco_features: [],
    status: 'active'
  })

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        
        if (data.categories) {
          // Filter out the "All" category since it's not for product creation
          const productCategories = data.categories.filter((cat: Category) => cat.id !== 'all')
          setCategories(productCategories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories
        setCategories([
          { id: 'home-living', name: 'Home & Living', description: 'Eco-friendly home products', image: '/bamboo-utensils.svg' },
          { id: 'personal-care', name: 'Personal Care', description: 'Natural personal care products', image: '/bamboo-utensils.svg' },
          { id: 'kitchen', name: 'Kitchen & Dining', description: 'Sustainable kitchen products', image: '/bamboo-utensils.svg' },
          { id: 'clothes', name: 'Clothes', description: 'Organic clothing', image: '/bamboo-utensils.svg' }
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }))
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      category_id: e.target.value
    }))
  }

  const handleEcoFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      eco_features: prev.eco_features.includes(feature)
        ? prev.eco_features.filter(f => f !== feature)
        : [...prev.eco_features, feature]
    }))
  }

  const handleStatusChange = (status: 'active' | 'draft') => {
    setFormData(prev => ({
      ...prev,
      status
    }))
  }

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
      if (files.length > 0) {
        setSelectedFiles(prev => [...prev, ...files])
        const previews = files.map(f => URL.createObjectURL(f))
        setFormData(prev => ({ ...prev, images: [...prev.images, ...previews] }))
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
      if (files.length > 0) {
        setSelectedFiles(prev => [...prev, ...files])
        const previews = files.map(f => URL.createObjectURL(f))
        setFormData(prev => ({ ...prev, images: [...prev.images, ...previews] }))
      }
    }
  }

  const addImageUrl = () => {
    const url = prompt("Enter image URL:")
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url.trim()]
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('title', formData.name)
      data.append('description', formData.description)
      data.append('price', String(formData.price))
      data.append('stock', String(formData.stock))
      data.append('category_id', formData.category_id)
      data.append('status', formData.status)

      // Append images: for object URLs we cannot get file again; rely on chosen files via file input
      // Attach any remote URL images as a text list the API can ignore for now
      const urlImages = formData.images.filter((u) => typeof u === 'string' && (u as string).startsWith('http'))
      if (urlImages.length > 0) {
        data.append('image_urls', JSON.stringify(urlImages))
      }

      // Attach selected files
      selectedFiles.forEach((file) => data.append('images', file))

      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
        credentials: 'include',
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({} as any))
        throw new Error(err.error || 'Failed to create product')
      }

      alert('Product added successfully!')
      router.push('/seller/products')
    } catch (error) {
      console.error('Error adding product:', error)
      alert("Failed to add product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/seller/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product listing for your store</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Information
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new product to your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category *</Label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? "Loading categories..." : "Select a category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Product Images</Label>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop images here, or click to select files
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>

              {/* Add URL Button */}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addImageUrl}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>

              {/* Display Images */}
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Uploaded Images:</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.png'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Product Status</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'active'}
                    onChange={(e) => handleStatusChange(e.target.checked ? 'active' : 'draft')}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Is Active</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.push('/seller/products')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}