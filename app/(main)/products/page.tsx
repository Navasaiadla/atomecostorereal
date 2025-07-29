import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// This would typically come from a database
const products = [
  {
    id: 'eco-friendly-bags',
    name: 'Eco-Friendly Bags',
    price: 399,
    rating: 4.8,
    reviews: 128,
    category: 'Bags',
    tag: 'Bestseller'
  },
  {
    id: 'organic-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 599,
    rating: 4.9,
    reviews: 89,
    category: 'Fashion',
    tag: 'New'
  },
  {
    id: 'bamboo-cups-spoons',
    name: 'Bamboo Cups & Spoons Set',
    price: 299,
    rating: 4.7,
    reviews: 156,
    category: 'Kitchen',
    tag: 'Popular'
  },
  {
    id: 'bamboo-toothbrush',
    name: 'Bamboo Toothbrush Set',
    price: 249,
    rating: 4.6,
    reviews: 92,
    category: 'Personal Care',
    tag: 'Eco-friendly'
  },
  {
    id: 'steel-water-bottle',
    name: 'Stainless Steel Water Bottle',
    price: 799,
    rating: 4.9,
    reviews: 215,
    category: 'Kitchen',
    tag: 'Bestseller'
  },
  {
    id: 'organic-shampoo',
    name: 'Organic Shampoo Bar',
    price: 349,
    rating: 4.7,
    reviews: 78,
    category: 'Personal Care',
    tag: 'New'
  }
]

const categories = [
  'All Categories',
  'Kitchen',
  'Personal Care',
  'Bags',
  'Fashion',
  'Home & Living',
  'Stationery'
]

const sortOptions = [
  'Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Rating',
  'Newest First'
]

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex items-center gap-4">
          <select className="border rounded-lg px-4 py-2">
            {sortOptions.map((option) => (
              <option key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#2B5219]" />
                    <span className="text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="border rounded px-3 py-2"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#2B5219]" />
                    <span className="text-gray-600">{rating}+ ★</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white">
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link 
                href={`/products/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow min-h-[280px] flex flex-col">
                  <div className="relative mb-6">
                    <span className="absolute top-0 left-0 bg-[#2B5219] text-white text-xs px-3 py-1 rounded-full">
                      {product.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-4 flex-grow">{product.name}</h3>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[#2B5219] font-semibold text-lg">₹{product.price}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                  </div>
                  <Button className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white">
                    Add to Cart
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 