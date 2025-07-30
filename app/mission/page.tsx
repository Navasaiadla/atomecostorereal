export default function MissionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Mission</h1>
          
          <div className="prose prose-lg mx-auto">
            <div className="bg-green-50 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Making Sustainability Accessible</h2>
              <p className="text-lg text-gray-600">
                At Atom Eco Store, we believe that sustainable living shouldn't be a luxury or a compromise. 
                Our mission is to make eco-friendly products accessible, affordable, and desirable for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 my-12">
              <div>
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Environmental Impact</h2>
                <p className="text-gray-600 mb-4">
                  Every product we curate is chosen with the environment in mind. We prioritize:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Products made from sustainable materials</li>
                  <li>• Minimal carbon footprint in production</li>
                  <li>• Eco-friendly packaging solutions</li>
                  <li>• Support for local artisans and small businesses</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Community Building</h2>
                <p className="text-gray-600 mb-4">
                  We're building a community of conscious consumers who understand that their choices matter. 
                  By supporting sustainable practices, we're creating a better future for:
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Future generations</li>
                  <li>• Local communities</li>
                  <li>• Artisan livelihoods</li>
                  <li>• Environmental conservation</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#2B5219] text-white rounded-2xl p-8 my-12">
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="font-semibold mb-2">Sustainability First</h3>
                  <p className="text-sm opacity-90">Every decision we make prioritizes environmental responsibility</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold mb-2">Community Support</h3>
                  <p className="text-sm opacity-90">Supporting local artisans and sustainable businesses</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm opacity-90">Continuously finding better ways to serve our planet</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Join Our Mission</h2>
              <p className="text-gray-600 mb-8">
                Every purchase you make is a vote for the kind of world you want to live in. 
                Choose sustainability, choose Atom Eco Store.
              </p>
              <a 
                href="/products" 
                className="inline-block bg-[#2B5219] text-white px-8 py-3 rounded-lg hover:bg-[#1a3110] transition-colors"
              >
                Start Shopping Sustainably
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 