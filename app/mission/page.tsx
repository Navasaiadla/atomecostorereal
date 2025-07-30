export default function MissionPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Our Mission</h1>
      <div className="space-y-6 text-gray-700">
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">Our Core Mission</h2>
          <p className="text-blue-800 text-lg leading-relaxed">
            To make sustainable living accessible, affordable, and convenient for every Indian household while supporting eco-conscious brands and reducing environmental impact.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">What Drives Us</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="font-medium text-green-700 mb-1">🌍 Environmental Protection</h3>
              <p>Reducing plastic waste and promoting sustainable alternatives in daily life.</p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="font-medium text-blue-700 mb-1">👥 Community Empowerment</h3>
              <p>Supporting local artisans, small businesses, and eco-friendly startups across India.</p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="font-medium text-yellow-700 mb-1">🎯 Conscious Consumption</h3>
              <p>Educating consumers about the impact of their choices and providing better alternatives.</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-4">
              <h3 className="font-medium text-purple-700 mb-1">💡 Innovation</h3>
              <p>Continuously discovering and promoting innovative eco-friendly solutions.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Our Goals</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Reach 1 million eco-conscious in some years </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Eliminate 10,000 kg of plastic waste annually through our alternatives</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Partner with 500+ sustainable brands and local artisans</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Achieve carbon-neutral delivery across all major Indian cities</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Join Our Movement</h2>
          <p className="text-gray-600">
            Every purchase you make is a vote for a more sustainable future. Together, we can create lasting positive change for our planet and future generations.
          </p>
        </div>
      </div>
    </div>
  );
} 