export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          At Atom Eco Store, we take your privacy seriously. This Privacy Policy describes how we collect,
          use, and protect your personal information when you use our website and services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Name and contact information</li>
          <li>Payment information (processed securely through Razorpay)</li>
          <li>Shipping address</li>
          <li>Order history</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Process your orders and payments</li>
          <li>Communicate with you about your orders</li>
          <li>Improve our services</li>
          <li>Send you updates and promotional offers (with your consent)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Payment Security</h2>
        <p className="mb-4">
          We use Razorpay for payment processing. Your payment information is securely handled according
          to industry standards and we do not store your payment details on our servers.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
        <p>
          If you have any questions about our Privacy Policy, please contact us at support@atomecostore.com
        </p>
      </div>
    </div>
  )
} 