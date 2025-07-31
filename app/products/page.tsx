import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

const products = [
  {
    id: 'eco-friendly-bag',
    name: 'Eco-Friendly Shopping Bag',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviews: 78,
    category: 'Home & Living',
    image: '/eco frendly bag.webp',
    tag: 'Reusable',
    discount: 33
  },
  {
    id: 'cotton-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviews: 156,
    category: 'Clothes',
    image: '/cotton tshirt.webp',
    tag: 'Sustainable',
    discount: 25
  },
  {
    id: 'bamboo-cup',
    name: 'Bamboo Travel Cup',
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    reviews: 92,
    category: 'Kitchen & Dining',
    image: '/bamboo cup.webp',
    tag: 'Eco-Friendly',
    discount: 29
  },
  {
    id: 'natural-book',
    name: 'Natural Book',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 45,
    category: 'Home & Living',
    image: '/natural book.webp',
    tag: 'Eco-Friendly',
    discount: 25
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
    tag: 'Eco-Friendly',
    discount: 33
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
    tag: 'Natural',
    discount: 31
  }
]

const categories = [
  { id: 'all', name: 'All Products', icon: '🌱' },
  { id: 'home-living', name: 'Home & Living', icon: '🏠' },
  { id: 'personal-care', name: 'Personal Care', icon: '🧴' },
  { id: 'kitchen', name: 'Kitchen & Dining', icon: '🍽️' },
  { id: 'clothes', name: 'Clothes', icon: '👕' }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sustainable Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of eco-friendly products that make a difference
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-[#2B5219] hover:bg-[#2B5219] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-[#2B5219] text-white text-xs px-3 py-1 rounded-full font-medium">
                        {product.category}
                      </div>
                    </div>

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="flex gap-3">
                          <button className="bg-white text-[#2B5219] p-3 rounded-full hover:bg-[#2B5219] hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button className="bg-white text-[#2B5219] p-3 rounded-full hover:bg-[#2B5219] hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Tag */}
                    <div className="mb-3">
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                        {product.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2B5219] transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl font-bold text-[#2B5219]">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link 
                        href={`/products/${product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-[#2B5219] hover:text-white text-[#2B5219] font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center"
                      >
                        View Details
                      </Link>
                      <Link 
                        href="/checkout"
                        className="flex-1 bg-[#2B5219] hover:bg-[#1a3110] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              className="border-2 border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Load More Products
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 