'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'

// Product data - in a real app, this would come from a database
const products = [
  {
    id: 'eco-friendly-bag',
    name: 'Eco-Friendly Shopping Bag',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviews: 78,
    tag: 'Reusable',
    category: 'Home & Living',
    image: '/eco frendly bag.webp',
    description: 'A sustainable and durable shopping bag made from eco-friendly materials. Perfect for grocery shopping, carrying books, or daily use. This reusable bag helps reduce plastic waste and is designed to last.',
    features: [
      'Made from 100% organic cotton',
      'Reinforced handles for durability',
      'Machine washable',
      'Folds compactly for storage',
      'Holds up to 15kg weight'
    ],
    specifications: {
      'Material': 'Organic Cotton',
      'Dimensions': '40cm x 35cm x 10cm',
      'Weight': '200g',
      'Capacity': '15kg',
      'Care': 'Machine washable at 30°C'
    },
    customerReviews: [
      {
        name: 'Priya S.',
        rating: 5,
        comment: 'Excellent quality! I use it daily for grocery shopping. Very sturdy and eco-friendly.'
      },
      {
        name: 'Rahul M.',
        rating: 4,
        comment: 'Great bag, good size. The handles are comfortable to carry. Highly recommend!'
      },
      {
        name: 'Anjali K.',
        rating: 5,
        comment: 'Perfect for my needs. Washes well and maintains its shape. Love the eco-friendly aspect.'
      }
    ]
  },
  {
    id: 'cotton-tshirt',
    name: 'Organic Cotton T-Shirt',
    price: 449,
    originalPrice: 599,
    rating: 4.8,
    reviews: 156,
    tag: 'Sustainable',
    category: 'Clothes',
    image: '/cotton tshirt.webp',
    description: 'Comfortable and breathable organic cotton t-shirt. Made from 100% certified organic cotton, this t-shirt is soft on your skin and gentle on the environment. Perfect for everyday wear.',
    features: [
      '100% certified organic cotton',
      'Breathable and comfortable',
      'Chemical-free production',
      'Fair trade certified',
      'Available in multiple sizes'
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Weight': '180 GSM',
      'Fit': 'Regular fit',
      'Care': 'Machine wash cold',
      'Certification': 'GOTS Certified'
    },
    customerReviews: [
      {
        name: 'Vikram R.',
        rating: 5,
        comment: 'Super soft and comfortable! The organic cotton feels amazing on my skin.'
      },
      {
        name: 'Meera P.',
        rating: 4,
        comment: 'Great quality t-shirt. Fits perfectly and washes well. Love that it\'s organic!'
      },
      {
        name: 'Arjun S.',
        rating: 5,
        comment: 'Excellent fit and quality. The fabric is breathable and perfect for Indian weather.'
      }
    ]
  },
  {
    id: 'bamboo-cup',
    name: 'Bamboo Travel Cup',
    price: 249,
    originalPrice: 349,
    rating: 4.7,
    reviews: 92,
    tag: 'Eco-Friendly',
    category: 'Kitchen & Dining',
    image: '/bamboo cup.webp',
    description: 'Elegant bamboo travel cup perfect for your daily coffee or tea. Made from sustainable bamboo, this cup is lightweight, durable, and keeps your beverages at the perfect temperature.',
    features: [
      'Made from sustainable bamboo',
      'Insulated design',
      'Leak-proof lid',
      'BPA-free materials',
      'Easy to clean'
    ],
    specifications: {
      'Material': 'Bamboo Fiber',
      'Capacity': '350ml',
      'Height': '12cm',
      'Diameter': '8cm',
      'Care': 'Hand wash recommended'
    },
    customerReviews: [
      {
        name: 'Sneha L.',
        rating: 5,
        comment: 'Beautiful cup! Keeps my coffee hot for hours. Love the bamboo design.'
      },
      {
        name: 'Karan J.',
        rating: 4,
        comment: 'Great travel cup. Lightweight and doesn\'t leak. Perfect for office use.'
      },
      {
        name: 'Divya M.',
        rating: 5,
        comment: 'Eco-friendly and stylish! The bamboo finish looks premium. Highly recommend.'
      }
    ]
  },
  {
    id: 'natural-book',
    name: 'Natural Book',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 45,
    tag: 'Eco-Friendly',
    category: 'Home & Living',
    image: '/natural book.webp',
    description: 'A beautifully crafted book made from natural, sustainable materials. This eco-friendly book features recycled paper and natural binding, making it perfect for environmentally conscious readers.',
    features: [
      'Made from 100% recycled paper',
      'Natural binding materials',
      'Acid-free pages',
      'Sustainable production process',
      'Perfect for gifting'
    ],
    specifications: {
      'Material': 'Recycled Paper',
      'Pages': '200 pages',
      'Size': 'A5 (14.8cm x 21cm)',
      'Binding': 'Natural glue binding',
      'Cover': 'Recycled cardboard'
    },
    customerReviews: [
      {
        name: 'Aisha K.',
        rating: 5,
        comment: 'Beautiful quality book! The paper feels great and I love that it\'s eco-friendly.'
      },
      {
        name: 'Rajesh P.',
        rating: 4,
        comment: 'Great book, good size for reading. The natural materials give it a unique feel.'
      },
      {
        name: 'Neha S.',
        rating: 5,
        comment: 'Perfect gift for book lovers who care about the environment. Highly recommend!'
      }
    ]
  },
  {
    id: 'bamboo-toothbrush',
    name: 'Bamboo Toothbrush Set',
    price: 199,
    originalPrice: 299,
    rating: 4.6,
    reviews: 234,
    tag: 'Eco-Friendly',
    category: 'Personal Care',
    image: '/bamboo-utensils.svg',
    description: 'Sustainable bamboo toothbrush set that helps reduce plastic waste. Made from natural bamboo, these toothbrushes are biodegradable and gentle on your teeth and gums.',
    features: [
      'Made from sustainable bamboo',
      'Soft bristles for gentle cleaning',
      'Biodegradable handle',
      'BPA-free bristles',
      'Set of 4 toothbrushes'
    ],
    specifications: {
      'Material': 'Bamboo Handle',
      'Bristles': 'Soft nylon',
      'Quantity': '4 toothbrushes',
      'Handle': 'Biodegradable bamboo',
      'Care': 'Replace every 3 months'
    },
    customerReviews: [
      {
        name: 'Sanjay M.',
        rating: 5,
        comment: 'Great toothbrushes! They clean well and I feel good about using eco-friendly products.'
      },
      {
        name: 'Priya L.',
        rating: 4,
        comment: 'Good quality bristles and comfortable handle. Love the bamboo design.'
      },
      {
        name: 'Amit K.',
        rating: 5,
        comment: 'Perfect for the whole family. The bamboo feels natural and sustainable.'
      }
    ]
  },
  {
    id: 'organic-soap',
    name: 'Organic Handmade Soap',
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    reviews: 189,
    tag: 'Natural',
    category: 'Personal Care',
    image: '/bamboo-utensils.svg',
    description: 'Handcrafted organic soap made with natural ingredients. This gentle soap is perfect for sensitive skin and provides a luxurious bathing experience while being kind to the environment.',
    features: [
      '100% natural ingredients',
      'Handmade in small batches',
      'Suitable for sensitive skin',
      'No harsh chemicals',
      'Long-lasting lather'
    ],
    specifications: {
      'Weight': '100g per bar',
      'Ingredients': 'Natural oils and herbs',
      'Fragrance': 'Essential oils',
      'Skin Type': 'All skin types',
      'Care': 'Keep dry between uses'
    },
    customerReviews: [
      {
        name: 'Maya R.',
        rating: 5,
        comment: 'Amazing soap! My skin feels so soft and the natural fragrance is wonderful.'
      },
      {
        name: 'Vikram S.',
        rating: 4,
        comment: 'Great for sensitive skin. No irritation and leaves skin feeling clean.'
      },
      {
        name: 'Anjali P.',
        rating: 5,
        comment: 'Love the natural ingredients and the way it makes my skin feel. Will buy again!'
      }
    ]
  }
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id)

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/products" className="inline-block bg-[#2B5219] hover:bg-[#1a3110] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
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
            <div className="space-y-4">
              <div className="relative">
                                 <Image
                   src={product.image}
                   alt={product.name}
                   width={600}
                   height={600}
                   className="w-full h-96 lg:h-[500px] object-contain bg-gray-50 rounded-xl shadow-lg"
                 />
                <span className="absolute top-4 left-4 bg-[#2B5219] text-white text-sm px-3 py-1.5 rounded-full font-semibold">
                  {product.tag}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.category}</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full">
                    <span className="text-amber-500">★</span>
                    <span className="font-medium text-gray-700">{product.rating} ({product.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#2B5219]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
                {product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="w-2 h-2 bg-[#2B5219] rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

                                                           {/* Action Buttons */}
                <div className="space-y-4 pt-6">
                  <div className="flex gap-4">
                    <button className="flex-1 bg-[#2B5219] hover:bg-[#1a3110] text-white py-3 text-lg font-semibold rounded-lg transition-colors">
                      Add to Cart
                    </button>
                    <Link href="/checkout" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-lg transition-colors text-center block">
                      Buy Now
                    </Link>
                  </div>
                </div>
            </div>
          </div>

                     {/* Reviews Section */}
           <div className="mt-16">
             <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {product.customerReviews.map((review: any, index: number) => (
                 <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex items-center gap-2 mb-3">
                     <div className="flex">
                       {[...Array(5)].map((_, i) => (
                         <span key={i} className={`text-sm ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}>
                           ★
                         </span>
                       ))}
                     </div>
                   </div>
                   <p className="text-gray-600 mb-3">{review.comment}</p>
                   <p className="text-sm font-medium text-gray-900">- {review.name}</p>
                 </div>
               ))}
             </div>
           </div>

           {/* Add Review Section */}
           <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
             <form className="space-y-6">
               <div>
                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                   Your Name
                 </label>
                 <input
                   type="text"
                   id="name"
                   name="name"
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                   placeholder="Enter your name"
                 />
               </div>
               
               <div>
                 <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                   Rating
                 </label>
                 <div className="flex items-center gap-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       type="button"
                       className="text-2xl text-gray-300 hover:text-amber-400 transition-colors"
                       onClick={() => {
                         // Handle rating selection
                       }}
                     >
                       ★
                     </button>
                   ))}
                 </div>
               </div>
               
               <div>
                 <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                   Your Review
                 </label>
                 <textarea
                   id="comment"
                   name="comment"
                   rows={4}
                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                   placeholder="Share your experience with this product..."
                 ></textarea>
               </div>
               
               <Button type="submit" className="bg-[#2B5219] hover:bg-[#1a3110] text-white py-3 px-6 font-semibold">
                 Submit Review
               </Button>
             </form>
           </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.id !== product.id).slice(0, 3).map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                    <span className="absolute top-3 left-3 bg-[#2B5219] text-white text-xs px-2 py-1 rounded-full">
                      {relatedProduct.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#2B5219]">₹{relatedProduct.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-sm text-gray-600">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 