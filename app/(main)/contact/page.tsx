import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          We're here to help! If you have any questions, concerns, or feedback, please don't hesitate
          to reach out to us.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Information</h2>
        <ul className="list-none pl-0 mb-4">
          <li className="mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@atomecostore.com" className="text-emerald-600 hover:text-emerald-700">
              support@atomecostore.com
            </a>
          </li>
          <li className="mb-2">
            <strong>Customer Support Hours:</strong> Monday to Friday, 9 AM to 6 PM IST
          </li>
          <li className="mb-2">
            <strong>Response Time:</strong> Within 24 hours on business days
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-4">For Business Inquiries</h2>
        <p className="mb-4">
          For partnership opportunities or business-related queries, please email us at{' '}
          <a href="mailto:business@atomecostore.com" className="text-emerald-600 hover:text-emerald-700">
            business@atomecostore.com
          </a>
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Office Address</h2>
        <p className="mb-4">
          Atom Eco Store<br />
          123 Green Street<br />
          Eco City, State 123456<br />
          India
        </p>

        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mt-8">
          <p className="text-emerald-700">
            <strong>Note:</strong> For order-related queries, please keep your order ID handy for faster assistance.
          </p>
        </div>
      </div>
    </div>
  )
} 