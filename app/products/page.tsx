import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const products = [
  {
    id: 'eco-friendly-bags',
    name: 'Eco-Friendly Bags',
    price: 399,
    rating: 4.8,
    reviews: 128,
    category: 'Home & Living',
    image: '/bags.png'
  },
  {
    id: 'organic-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 599,
    rating: 4.9,
    reviews: 89,
    category: 'Personal Care',
    image: '/tshirt.webp'
  },
  {
    id: 'bamboo-cups-spoons',
    name: 'Bamboo Cups & Spoons Set',
    price: 299,
    rating: 4.7,
    reviews: 156,
    category: 'Kitchen & Dining',
    image: '/cupsandspoons.png'
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover our collection of sustainable and eco-friendly products</p>
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
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#2B5219] font-semibold text-lg">₹{product.price}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                  </div>
                </div>
                <Button className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white">
                  View Details
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 