export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Shipping & Delivery Policy</h1>
      <div className="space-y-4 text-gray-700">
        <ul className="list-disc list-inside space-y-2">
          <li>Orders are shipped within 1–3 business days.</li>
          <li>Delivery takes 3–7 working days in Tier-1 Indian cities.</li>
          <li>We use eco-friendly packaging materials.</li>
          <li>Free shipping on orders above ₹999.</li>
          <li>You'll receive tracking details once your order is dispatched.</li>
        </ul>
        
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="font-medium text-green-800">
            🌱 We're committed to sustainable packaging and carbon-neutral shipping whenever possible.
          </p>
        </div>
      </div>
    </div>
  );
} 
