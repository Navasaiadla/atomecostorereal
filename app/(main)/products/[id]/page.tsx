import Image from 'next/image'
import { Button } from '@/components/ui/button'

// This would typically come from a database
const product = {
  id: 'bamboo-cups-spoons',
  name: 'Bamboo Cups & Spoons Set',
  price: 299,
  rating: 4.7,
  reviews: 156,
  stock: 50,
  description: 'Eco-friendly bamboo cups and spoons set perfect for everyday use. Made from sustainable bamboo, these products are naturally antibacterial and biodegradable.',
  features: [
    'Made from 100% organic bamboo',
    'Naturally antibacterial',
    'Lightweight and portable',
    'Includes 4 cups and 4 spoons',
    'Dishwasher safe',
    'Perfect for travel and everyday use'
  ],
  specifications: {
    material: 'Organic Bamboo',
    dimensions: 'Cups: 8cm x 6cm, Spoons: 15cm',
    weight: '200g',
    package: 'Recycled cardboard box',
    care: 'Dishwasher safe, hand wash recommended',
    origin: 'Responsibly sourced from India'
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-2xl font-bold text-[#2B5219]">₹{product.price}</div>
            <div className="flex items-center gap-1">
              <span className="text-amber-400">★</span>
              <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-6 mb-8">
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Availability:</span>
              <span className="text-green-600">{product.stock} in stock</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-gray-600">Quantity:</label>
              <select className="border rounded-lg px-3 py-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-[#2B5219] hover:bg-[#1a3110] text-white">
                Add to Cart
              </Button>
              <Button className="flex-1 bg-[#8B6D4D] hover:bg-[#725a40] text-white">
                Buy Now
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="list-disc pl-6 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key}>
                  <div className="font-medium text-gray-900 capitalize">{key}</div>
                  <div className="text-gray-600">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Image Placeholder */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🛍️</div>
            <p className="text-gray-500">Product Image</p>
          </div>
        </div>
      </div>
    </div>
  )
} 