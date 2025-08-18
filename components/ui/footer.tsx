import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-gray-200 mt-auto">
      <div className="container mx-auto px-2 md:px-4 py-6 md:py-12">
        {/* Top Row - Logo left aligned as earlier; description next to it */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-start text-left gap-4 md:gap-8 mb-8 md:mb-12">
          <Image 
            src="/logo2.png"
            alt="Atom Eco Store"
            width={180}
            height={60}
            className="mb-2 md:mb-0"
          />
          <p className="text-gray-300 text-xs md:text-sm max-w-md">
            India's trusted marketplace for sustainable, eco-friendly products.
          </p>
        </div>

        {/* Bottom Row - 4 Columns centered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto text-center">

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-white mb-2 md:mb-4 text-xs md:text-base">Quick Links</h3>
            <ul className="space-y-1 md:space-y-3">
                              <li>
                  <Link href="/about" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/mission" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Blog
                  </Link>
                </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-medium text-white mb-2 md:mb-4 text-xs md:text-base">Customer Care</h3>
            <ul className="space-y-1 md:space-y-3">
                              <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Contact
                  </Link>
                </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-white mb-2 md:mb-4 text-xs md:text-base">Contact Us</h3>
            <ul className="space-y-1 md:space-y-3">
                              <li>
                  <a href="mailto:atomecostores@gmail.com" className="text-gray-300 hover:text-white flex items-center gap-2 text-xs md:text-sm">
                    <span>📧</span>
                    <span className="hidden sm:inline">atomecostores@gmail.com</span>
                    <span className="sm:hidden">Email</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919390119683" className="text-gray-300 hover:text-white flex items-center gap-2 text-xs md:text-sm">
                    <span>📞</span>
                    <span className="hidden sm:inline">+91 9390119683</span>
                    <span className="sm:hidden">Call</span>
                  </a>
                </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-white mb-2 md:mb-4 text-xs md:text-base">Legal</h3>
            <ul className="space-y-1 md:space-y-3">
                              <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="text-gray-300 hover:text-white text-xs md:text-sm">
                    Refund
                  </Link>
                </li>
                <li>
                  <Link href="/seller/dashboard" className="text-gray-300 hover:text-white text-xs md:text-sm">
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