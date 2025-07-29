export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Refund & Cancellation Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          We want you to be completely satisfied with your purchase. This policy outlines our guidelines
          for refunds and cancellations.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Order Cancellation</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Orders can be cancelled before shipping</li>
          <li>Full refund will be processed for cancelled orders</li>
          <li>Refund will be credited back to the original payment method</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Refund Process</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Refunds are processed through Razorpay</li>
          <li>Processing time: 5-7 business days</li>
          <li>You will receive an email confirmation when refund is initiated</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Non-Refundable Items</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Customized or personalized products</li>
          <li>Items marked as non-returnable</li>
          <li>Used or damaged products</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
        <p>
          For any questions about refunds, please contact us at support@atomecostore.com
        </p>
      </div>
    </div>
  )
} 