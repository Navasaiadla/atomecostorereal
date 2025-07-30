export default function FAQPage() {
  const faqs = [
    {
      question: "What makes your products eco-friendly?",
      answer: "All our products are carefully selected based on their environmental impact. We prioritize items made from sustainable materials, produced with minimal carbon footprint, and packaged in eco-friendly materials."
    },
    {
      question: "Do you ship nationwide?",
      answer: "Yes, we ship to all major cities and towns across India. We use eco-friendly packaging materials and partner with delivery services that share our commitment to sustainability."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all products in their original condition. If you're not satisfied with your purchase, you can return it for a full refund or exchange."
    },
    {
      question: "Are your products certified organic?",
      answer: "Many of our products are certified organic. We clearly label all certifications on product pages so you can make informed decisions about your purchases."
    },
    {
      question: "How do you ensure product quality?",
      answer: "We work directly with trusted artisans and sustainable brands. Each product undergoes quality checks before being listed on our platform to ensure it meets our high standards."
    },
    {
      question: "Do you offer bulk discounts?",
      answer: "Yes, we offer special pricing for bulk orders and corporate purchases. Please contact our customer support team for more information about bulk pricing."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2B5219] mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-[#2B5219] text-white px-8 py-3 rounded-lg hover:bg-[#1a3110] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 