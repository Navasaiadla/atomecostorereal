import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="col-span-1">
            <Image 
              src="/logo3.png"
              alt="Atom Eco Store"
              width={180}
              height={60}
              className="mb-4"
            />
            <p className="text-gray-600 text-sm">
              India's trusted marketplace for sustainable, eco-friendly products. Making green living accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#2B5219]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-[#2B5219]">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-gray-600 hover:text-[#2B5219]">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#2B5219]">
                  Sustainability Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-[#2B5219]">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#2B5219]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-[#2B5219]">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#2B5219]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:atomecostores@gmail.com" className="text-gray-600 hover:text-[#2B5219] flex items-center gap-2">
                  <span>📧</span>
                  atomecostores@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919390119683" className="text-gray-600 hover:text-[#2B5219] flex items-center gap-2">
                  <span>📞</span>
                  +91 9390119683
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-[#2B5219]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#2B5219]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-600 hover:text-[#2B5219]">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/sell-here" className="text-gray-600 hover:text-[#2B5219]">
                  Sell Here
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
} 