'use client'

export default function SellerAnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your sales performance and insights</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📈</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics coming soon</h3>
        <p className="text-gray-600 mb-6">Detailed analytics and insights will be available once you start selling</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="text-sm font-medium text-blue-900 mb-2">📊 What you'll see:</h4>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• Sales performance over time</li>
            <li>• Top-selling products</li>
            <li>• Customer insights</li>
            <li>• Revenue trends</li>
            <li>• Product performance metrics</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
