import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Atom Eco Store</h1>
          
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              Atom Eco Store is India's premier destination for sustainable, eco-friendly products. 
              We believe that every small choice we make can have a big impact on our planet's future.
            </p>

            <div className="grid md:grid-cols-2 gap-12 my-12">
              <div>
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Our Mission</h2>
                <p className="text-gray-600">
                  To make sustainable living accessible, affordable, and desirable for everyone. 
                  We curate products that are not only good for the environment but also enhance your daily life.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Our Values</h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Environmental responsibility</li>
                  <li>• Supporting local artisans</li>
                  <li>• Quality and durability</li>
                  <li>• Transparency in sourcing</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-8 my-12">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Why Choose Us?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🌱</span>
                  </div>
                  <h3 className="font-semibold mb-2">Eco-Friendly</h3>
                  <p className="text-sm text-gray-600">All products are sustainably sourced and environmentally conscious</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🏆</span>
                  </div>
                  <h3 className="font-semibold mb-2">Quality Assured</h3>
                  <p className="text-sm text-gray-600">Rigorous quality checks ensure you get the best products</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#2B5219] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl">🚚</span>
                  </div>
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">Quick and eco-friendly packaging and delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 