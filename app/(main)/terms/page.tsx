export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          By using Atom Eco Store, you agree to these terms. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using this website, you accept and agree to be bound by the terms and
          provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">2. Payment Terms</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>All payments are processed securely through Razorpay</li>
          <li>Prices are in Indian Rupees (INR)</li>
          <li>Prices include applicable taxes</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">3. Shipping Policy</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Orders are typically processed within 1-2 business days</li>
          <li>Shipping times vary by location</li>
          <li>Tracking information will be provided via email</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">4. User Responsibilities</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate information for orders</li>
          <li>Maintain account security</li>
          <li>Use the website legally and ethically</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Contact</h2>
        <p>
          For any questions about these terms, please contact us at support@atomecostore.com
        </p>
      </div>
    </div>
  )
} 