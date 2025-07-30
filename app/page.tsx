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
  }
]

const featuredProducts = [
  {
    id: 'eco-friendly-bags',
    name: 'Eco-Friendly Bags',
    price: 399,
    rating: 4.8,
    reviews: 128,
    tag: 'Bestseller'
  },
  {
    id: 'organic-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 599,
    rating: 4.9,
    reviews: 89,
    tag: 'New'
  },
  {
    id: 'bamboo-cups-spoons',
    name: 'Bamboo Cups & Spoons Set',
    price: 299,
    rating: 4.7,
    reviews: 156,
    tag: 'Popular'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Choose Earth-Friendly,<br />Live Sustainably
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Discover handpicked eco-friendly products from local artisans and sustainable brands. Make every purchase count for our planet.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-[#2B5219] hover:bg-[#1a3110] text-white px-8">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
                  href={`/categories/${category.id}`} 
                  key={category.id}
                  className="group w-full sm:w-[280px]"
                >
                  <div className={`${category.color} rounded-xl p-8 transition-all duration-200 hover:shadow-lg h-full`}>
                    <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                    <p className="text-gray-600 text-sm mb-6">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{category.productCount} Products</span>
                      <span className="text-[#2B5219] group-hover:translate-x-2 transition-transform duration-200">
                        →
                      </span>
                    </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link 
                  href={`/products/${product.id}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 transition-all duration-200 hover:shadow-lg min-h-[280px] flex flex-col">
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
        </section>
      </main>
      <Footer />
    </div>
  )
} 