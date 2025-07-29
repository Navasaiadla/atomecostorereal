export default function SustainabilityPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Sustainability</h1>
      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          Sustainability isn't just our business model – it's our responsibility. At Atom Eco Store, every decision we make considers its impact on the environment and future generations.
        </p>

        <div className="bg-green-50 border-l-4 border-green-400 p-6">
          <h2 className="text-lg font-semibold mb-3 text-green-800">Our Sustainability Promise</h2>
          <p className="text-green-700">
            We are committed to operating a fully sustainable business that not only minimizes environmental harm but actively contributes to ecological restoration and social good.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Our Sustainable Practices</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly Packaging</h3>
              <ul className="text-sm space-y-1">
                <li>• 100% recyclable cardboard boxes</li>
                <li>• Biodegradable void fill</li>
                <li>• Paper tape instead of plastic</li>
                <li>• Reused packaging when possible</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Carbon-Neutral Shipping</h3>
              <ul className="text-sm space-y-1">
                <li>• Optimized delivery routes</li>
                <li>• Electric vehicle partnerships</li>
                <li>• Carbon offset programs</li>
                <li>• Local fulfillment centers</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Curation</h3>
              <ul className="text-sm space-y-1">
                <li>• Strict sustainability criteria</li>
                <li>• Life cycle impact assessment</li>
                <li>• Support for circular economy</li>
                <li>• Zero-waste alternatives</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Impact</h3>
              <ul className="text-sm space-y-1">
                <li>• Fair trade partnerships</li>
                <li>• Support for women entrepreneurs</li>
                <li>• Local artisan networks</li>
                <li>• Educational initiatives</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Our Environmental Impact</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">50,000+</div>
                <div className="text-sm text-blue-800">Plastic items replaced</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-blue-800">Packaging recycled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">200+</div>
                <div className="text-sm text-blue-800">Eco brands supported</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Certifications & Standards</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Organic Certified</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Carbon Neutral</span>
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Fair Trade</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Cruelty-Free</span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Zero Waste</span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Together for Tomorrow</h2>
          <p className="text-gray-600">
            Sustainability is a journey, not a destination. Join us as we continue to innovate and improve our practices for a healthier planet.
          </p>
        </div>
      </div>
    </div>
  );
} 