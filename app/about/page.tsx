import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">About Us</h1>
      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-relaxed">
          Welcome to <strong className="text-green-600">Atom Eco Store</strong> – your trusted destination for sustainable, natural, and eco-friendly products that make a positive impact on both your life and our planet.
        </p>
        
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <h2 className="text-lg font-semibold mb-2 text-green-800">Our Story</h2>
          <p className="text-green-700">
            Founded with a passion for environmental conservation, Atom Eco Store began as a small initiative to provide Indian consumers with access to high-quality, sustainable alternatives to everyday products.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>100% natural and organic personal care products</li>
            <li>Eco-friendly home and kitchen essentials</li>
            <li>Sustainable fashion and lifestyle items</li>
            <li>Zero-waste and plastic-free alternatives</li>
            <li>Locally sourced and ethically made products</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Why Choose Atom Eco Store?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">🌱 Authenticity</h3>
              <p className="text-sm">Every product is carefully curated and verified for its eco-friendly credentials.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">🚚 Fast Delivery</h3>
              <p className="text-sm">Quick and reliable shipping across India with eco-friendly packaging.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">💚 Community Impact</h3>
              <p className="text-sm">Supporting local artisans and eco-conscious brands across India.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">🔒 Trust</h3>
              <p className="text-sm">Transparent business practices and customer-first approach.</p>
            </div>
          </div>
        </div>

        <p className="text-center font-medium text-green-600 text-lg">
          Join us in creating a more sustainable future, one purchase at a time.
        </p>
      </div>
    </div>
  );
} 