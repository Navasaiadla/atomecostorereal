import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

const categories = [
  {
    id: 'home-living',
    title: 'Home & Living',
    description: 'Sustainable solutions for your home',
    productCount: 45,
    color: 'bg-green-50'
  },
  {
    id: 'personal-care',
    title: 'Personal Care',
    description: 'Natural and chemical-free personal care',
    productCount: 32,
    color: 'bg-amber-50'
  },
  {
    id: 'kitchen',
    title: 'Kitchen & Dining',
    description: 'Eco-friendly kitchen essentials',
    productCount: 28,
    color: 'bg-blue-50'
  },
  {
    id: 'clothes',
    title: 'Clothes',
    description: 'Sustainable and organic clothing',
    productCount: 24,
    color: 'bg-purple-50'
  }
]

const featuredProducts = [
  {
    id: 'eco-friendly-bag',
    name: 'Eco-Friendly Shopping Bag',
    price: 199,
    rating: 4.6,
    reviews: 78,
    tag: 'Reusable',
    image: '/eco frendly bag.webp'
  },
  {
    id: 'cotton-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 449,
    rating: 4.8,
    reviews: 156,
    tag: 'Sustainable',
    image: '/cotton tshirt.webp'
  },
  {
    id: 'bamboo-cup',
    name: 'Bamboo Travel Cup',
    price: 249,
    rating: 4.7,
    reviews: 92,
    tag: 'Eco-Friendly',
    image: '/bamboo cup.webp'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Choose Earth-Friendly,<br />Live Sustainably
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 drop-shadow-md">
                Discover handpicked eco-friendly products from local artisans and sustainable brands. Make every purchase count for our planet.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products" className="inline-block bg-white hover:bg-green-50 text-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-white opacity-15 rounded-full"></div>
          <div className="absolute top-1/2 left-5 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </section>

        {/* Categories Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Shop by Category</h2>
            <p className="text-center text-gray-600 mb-8">
              Find exactly what you need in our curated categories
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {categories.map((category) => (
                <Link 
                  href="/products" 
                  key={category.id}
                  className={`group w-full sm:w-[280px] ${category.color} rounded-xl p-8 transition-all duration-200 hover:shadow-lg h-full block`}
                >
                  <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                  <p className="text-gray-600 text-sm mb-6">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.productCount} Products</span>
                    <span className="text-[#2B5219] group-hover:translate-x-2 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Featured Products</h2>
            <p className="text-center text-gray-600 mb-12">
              Handpicked sustainable products for conscious living
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-[520px] overflow-hidden border border-gray-100">
                    <Link href={`/products/${product.id}`} className="block flex-1">
                      <div className="relative h-64">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-4 left-4 bg-[#2B5219] text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                          {product.tag}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem]">{product.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[#2B5219]">₹{product.price}</span>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                            <span className="text-amber-500 text-sm">★</span>
                            <span className="text-sm font-medium text-gray-700">{product.rating} ({product.reviews})</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-6 pt-0 space-y-4">
                      <button className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105">
                        Add to Cart
                      </button>
                      <Link href="/checkout" className="block w-full bg-orange-500 hover:bg-orange-600 text-white py-3 font-semibold rounded-lg transition-all duration-200 hover:scale-105 text-center">
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/products" className="inline-block bg-[#2B5219] hover:bg-[#1a3110] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 