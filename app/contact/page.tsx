import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Send us a Message</h2>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2B5219]"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <Button type="submit" className="w-full bg-[#2B5219] hover:bg-[#1a3110] text-white">
                  Send Message
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
                             <div className="bg-white rounded-2xl p-8">
                 <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Get in Touch</h2>
                 
                 <div className="space-y-6">
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-[#2B5219] rounded-full flex items-center justify-center flex-shrink-0">
                       <span className="text-white">📧</span>
                     </div>
                     <div>
                       <h3 className="font-semibold text-gray-900">Email</h3>
                       <p className="text-gray-600">atomecostores@gmail.com</p>
                     </div>
                   </div>
                   
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 bg-[#2B5219] rounded-full flex items-center justify-center flex-shrink-0">
                       <span className="text-white">📞</span>
                     </div>
                     <div>
                       <h3 className="font-semibold text-gray-900">Phone</h3>
                       <p className="text-gray-600">+91 9390119683</p>
                     </div>
                   </div>
                 </div>
               </div>git status
              
                             <div className="bg-white rounded-2xl p-8">
                 <h2 className="text-2xl font-semibold text-[#2B5219] mb-6">Business Hours</h2>
                 <div className="space-y-3">
                   <div className="flex justify-between">
                     <span className="text-gray-600">Monday - Friday</span>
                     <span className="font-medium">9:00 AM - 6:00 PM</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Saturday</span>
                     <span className="font-medium">10:00 AM - 4:00 PM</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-600">Sunday</span>
                     <span className="font-medium">10:00 AM - 4:00 PM</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 