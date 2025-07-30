import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

// Product database - in a real app, this would come from a database
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
    description: 'Made from 100% recycled materials, these eco-friendly bags are perfect for shopping, storage, and everyday use. Each bag saves approximately 3 plastic bags from entering landfills.',
    features: [
      '100% recycled materials',
      'Biodegradable',
      'Reusable and washable',
      'Strong and durable',
      'Multiple sizes available'
    ],
    specifications: {
      'Material': 'Recycled cotton and jute',
      'Weight': '200g',
      'Dimensions': '40cm x 35cm x 10cm',
      'Care Instructions': 'Hand wash with mild soap',
      'Certification': 'GOTS Certified Organic'
    },
    inStock: true,
    stockCount: 45,
    shipping: 'Free shipping on orders above ₹999',
    returnPolicy: '7-day return policy'
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
    description: 'Premium organic cotton t-shirt that feels soft against your skin while being kind to the environment. Grown without harmful pesticides and dyed with natural, non-toxic colors.',
    features: [
      '100% organic cotton',
      'Chemical-free dyeing',
      'Fair trade certified',
      'Breathable fabric',
      'Multiple colors available'
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Weight': '180 GSM',
      'Fit': 'Regular fit',
      'Care Instructions': 'Machine wash cold',
      'Certification': 'GOTS, Fair Trade'
    },
    inStock: true,
    stockCount: 32,
    shipping: 'Free shipping on orders above ₹999',
    returnPolicy: '7-day return policy'
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
    description: 'Beautiful and sustainable bamboo cups and spoons set. Perfect for your morning coffee or tea. Bamboo is naturally antibacterial and grows quickly without pesticides.',
    features: [
      'Natural bamboo material',
      'Antibacterial properties',
      'Lightweight and durable',
      'Set of 4 cups + 4 spoons',
      'Microwave safe'
    ],
    specifications: {
      'Material': 'Natural Bamboo',
      'Set Contents': '4 cups + 4 spoons',
      'Cup Capacity': '250ml each',
      'Care Instructions': 'Hand wash with mild soap',
      'Certification': 'FSC Certified'
    },
    inStock: true,
    stockCount: 28,
    shipping: 'Free shipping on orders above ₹999',
    returnPolicy: '7-day return policy'
  }
]

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find(p => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-[#2B5219]">Home</Link></li>
            <li>/</li>
            <li><Link href="/products" className="hover:text-[#2B5219]">Products</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
              />
              <span className="absolute top-4 left-4 bg-[#2B5219] text-white text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.originalPrice > product.price && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-gray-600">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reviews)</span>
                </div>
                <span className="text-green-600 font-medium">
                  {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#2B5219]">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Returns */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">🚚</span>
                <span className="font-medium text-blue-900">Shipping & Returns</span>
              </div>
              <p className="text-blue-700 text-sm mb-2">{product.shipping}</p>
              <p className="text-blue-700 text-sm">{product.returnPolicy}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white py-3 text-lg"
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                disabled={!product.inStock}
              >
                {product.inStock ? 'Buy Now' : 'Out of Stock'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-[#2B5219] text-[#2B5219] hover:bg-[#2B5219] hover:text-white py-3"
              >
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link 
                  href={`/products/${relatedProduct.id}`} 
                  key={relatedProduct.id}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 transition-all duration-200 hover:shadow-lg">
                    <div className="relative mb-4">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-[#2B5219] text-white text-xs px-2 py-1 rounded">
                        {relatedProduct.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[#2B5219] font-semibold text-lg">₹{relatedProduct.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400">★</span>
                        <span className="text-sm text-gray-600">{relatedProduct.rating} ({relatedProduct.reviews})</span>
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
        </div>
      </div>
    </div>
  )
} 