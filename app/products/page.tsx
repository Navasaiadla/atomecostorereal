import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 'eco-friendly-bags',
    name: 'Eco-Friendly Bags',
    price: 399,
    originalPrice: 599,
    rating: 4.8,
    reviews: 128,
    category: 'Home & Living',
    image: '/bags.png',
    tag: 'Bestseller'
  },
  {
    id: 'organic-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviews: 89,
    category: 'Personal Care',
    image: '/tshirt.webp',
    tag: 'New'
  },
  {
    id: 'bamboo-cups-spoons',
    name: 'Bamboo Cups & Spoons Set',
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    reviews: 156,
    category: 'Kitchen & Dining',
    image: '/cupsandspoons.png',
    tag: 'Popular'
  },
  {
    id: 'bamboo-toothbrush',
    name: 'Bamboo Toothbrush Set',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviews: 234,
    category: 'Personal Care',
    image: '/bamboo-utensils.svg',
    tag: 'Eco-Friendly'
  },
  {
    id: 'recycled-notebook',
    name: 'Recycled Paper Notebook',
    price: 149,
    originalPrice: 199,
    rating: 4.5,
    reviews: 67,
    category: 'Home & Living',
    image: '/bamboo-utensils.svg',
    tag: 'Sustainable'
  },
  {
    id: 'organic-soap',
    name: 'Organic Handmade Soap',
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    reviews: 189,
    category: 'Personal Care',
    image: '/bamboo-utensils.svg',
    tag: 'Natural'
  }
]

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'personal-care', name: 'Personal Care' },
  { id: 'kitchen', name: 'Kitchen & Dining' },
  { id: 'clothes', name: 'Clothes' }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover our collection of sustainable and eco-friendly products</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:border-[#2B5219] hover:bg-[#2B5219] hover:text-white transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
                <div className="relative mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <span className="absolute top-2 left-2 bg-[#2B5219] text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.tag && (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      {product.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#2B5219] font-semibold text-lg">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-500 text-sm line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white">
                    View Details
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Buy Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white px-8 py-3"
          >
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
} 