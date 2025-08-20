'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const faqItems: FAQItem[] = [
    {
      question: "How do I place an order?",
      answer: "To place an order, browse our products, add items to your cart, proceed to checkout, enter your shipping and payment information, and confirm your order. You'll receive an order confirmation email once your purchase is complete.",
      category: "ordering"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards (Visa, Mastercard, American Express), UPI, net banking, wallets (PayTM, PhonePe, Google Pay), and cash on delivery (for orders under ₹5000).",
      category: "payment"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also view your order status by logging into your account and visiting the 'My Orders' section.",
      category: "shipping"
    },
    {
      question: "What is your shipping timeframe?",
      answer: "Standard shipping takes 3-7 business days depending on your location. Express shipping takes 1-3 business days. Please note that remote areas may require additional time.",
      category: "shipping"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working on expanding our shipping capabilities to serve international customers in the near future.",
      category: "shipping"
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 6 days of delivery. Items must be unused, in original packaging, and accompanied by the receipt. Some items like perishables and personal care products (if opened) cannot be returned.",
      category: "returns"
    },
    {
      question: "How do I initiate a return?",
      answer: "To initiate a return, email returns@atomecostore.com with your order number and reason for return. We'll provide you with a Return Authorization Number and return instructions.",
      category: "returns"
    },
    {
      question: "How long does it take to process a refund?",
      answer: "Once we receive your return, we'll inspect the item and process your refund within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment method (typically 3-10 business days).",
      category: "returns"
    },
    {
      question: "What makes your products eco-friendly?",
      answer: "Our products meet strict sustainability criteria including use of renewable or recycled materials, minimal packaging, ethical manufacturing processes, and reduced carbon footprint. Each product listing includes detailed information about its eco-friendly features.",
      category: "products"
    },
    {
      question: "Are your products certified organic/sustainable?",
      answer: "Many of our products carry certifications such as GOTS (Global Organic Textile Standard), Fair Trade, ECOCERT, Forest Stewardship Council (FSC), and more. You can find specific certifications listed on individual product pages.",
      category: "products"
    },
    {
      question: "How do you verify vendor sustainability claims?",
      answer: "We have a rigorous vendor vetting process that includes documentation review, certification verification, facility inspections (when possible), and regular audits. We also collect customer feedback to ensure ongoing compliance with our sustainability standards.",
      category: "products"
    },
    {
      question: "How can I become a vendor on Atom Eco Store?",
      answer: "If you produce sustainable products and would like to sell on our platform, please visit our 'Sell With Us' page or email vendors@atomecostore.com with details about your products and sustainability practices.",
      category: "vendors"
    },
    {
      question: "Do you have a physical store?",
      answer: "Currently, we operate exclusively online. However, we occasionally participate in sustainable living expos and pop-up markets across major Indian cities. Follow us on social media for announcements about these events.",
      category: "general"
    },
    {
      question: "How can I contact customer service?",
      answer: "You can reach our customer service team via email at support@atomecostore.com or by phone at +91 123 456 7890 during business hours (Monday to Friday, 9:00 AM to 6:00 PM IST).",
      category: "general"
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer eco-friendly gift wrapping using recycled paper and natural materials for a small additional fee. You can select this option during checkout and even include a personalized message.",
      category: "ordering"
    }
  ]
  
  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'ordering', name: 'Ordering' },
    { id: 'payment', name: 'Payment' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'products', name: 'Products' },
    { id: 'vendors', name: 'Vendors' },
    { id: 'general', name: 'General' }
  ]
  
  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-text-muted mb-8">Find answers to common questions about our products, ordering process, shipping, and more.</p>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-border rounded-lg text-base bg-white text-text-primary placeholder-text-muted focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-beige text-text-secondary hover:bg-sand'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-text-muted">No results found for "{searchQuery}"</p>
            <button 
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="mt-4 text-primary hover:underline"
            >
              Clear search and show all FAQs
            </button>
          </div>
        )}
      </div>
      
      {/* Still Have Questions */}
      <div className="mt-12 bg-beige rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
        <p className="text-text-secondary mb-6">
          Can't find what you're looking for? We're here to help!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="/support" 
            className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg text-base font-medium transition-all"
          >
            Contact Us
          </a>
          <a 
            href="mailto:support@atomecostore.com" 
            className="bg-white border border-primary text-primary hover:bg-beige px-6 py-3 rounded-lg text-base font-medium transition-all"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-beige transition-colors"
      >
        <h3 className="font-medium text-lg text-text-primary">{question}</h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-beige border-t border-border">
          <p className="text-text-secondary">{answer}</p>
        </div>
      )}
    </div>
  )
} 