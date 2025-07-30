export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Commitment to Sustainability</h1>
          
          <div className="space-y-12">
            {/* Introduction */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Why Sustainability Matters</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Atom Eco Store, sustainability isn't just a buzzword—it's the foundation of everything we do. 
                We believe that every purchase can be a positive choice for our planet.
              </p>
              <p className="text-gray-600">
                Our commitment to sustainability extends beyond just selling eco-friendly products. 
                We're building a community of conscious consumers who understand that their choices matter.
              </p>
            </div>

            {/* Our Practices */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Our Sustainable Practices</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Selection</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Only products made from sustainable materials</li>
                    <li>• Support for local artisans and small businesses</li>
                    <li>• Fair trade and ethical sourcing</li>
                    <li>• Minimal carbon footprint in production</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging & Shipping</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• 100% recyclable packaging materials</li>
                    <li>• Biodegradable packing materials</li>
                    <li>• Carbon-neutral shipping options</li>
                    <li>• Minimal packaging waste</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-[#2B5219] text-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center">Our Impact</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <p className="text-sm opacity-90">Trees planted through our partnerships</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">10,000+</div>
                  <p className="text-sm opacity-90">Plastic bottles saved from landfills</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">50+</div>
                  <p className="text-sm opacity-90">Local artisans supported</p>
                </div>
              </div>
            </div>

            {/* Material Guide */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Sustainable Materials Guide</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Bamboo</h3>
                    <p className="text-sm text-gray-600">Fast-growing, renewable, and biodegradable</p>
                  </div>
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Organic Cotton</h3>
                    <p className="text-sm text-gray-600">Grown without harmful pesticides</p>
                  </div>
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Recycled Materials</h3>
                    <p className="text-sm text-gray-600">Giving new life to existing resources</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Hemp</h3>
                    <p className="text-sm text-gray-600">Durable and requires minimal water</p>
                  </div>
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Cork</h3>
                    <p className="text-sm text-gray-600">Harvested without harming trees</p>
                  </div>
                  <div className="border-l-4 border-[#2B5219] pl-4">
                    <h3 className="font-semibold text-gray-900">Natural Fibers</h3>
                    <p className="text-sm text-gray-600">Jute, sisal, and other plant-based materials</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-4">Join Our Mission</h2>
              <p className="text-gray-600 mb-6">
                Every purchase you make is a vote for the kind of world you want to live in. 
                Choose sustainability, choose Atom Eco Store.
              </p>
              <a 
                href="/products" 
                className="inline-block bg-[#2B5219] text-white px-8 py-3 rounded-lg hover:bg-[#1a3110] transition-colors"
              >
                Shop Sustainably
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 