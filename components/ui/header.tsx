'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from './button'

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo3.png" 
              alt="Atom Eco Store" 
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for eco-friendly products..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-green-600"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 text-white bg-[#2B5219] rounded hover:bg-green-800">
                Search
              </button>
            </div>
          </div>

                           {/* Cart and Login/Logout */}
                 <div className="flex items-center gap-4">
                   <Link href="/cart" className="relative group">
                     <div className="w-12 h-12 bg-gradient-to-r from-[#2B5219] to-[#4a7c3a] rounded-full flex items-center justify-center text-white hover:from-[#1a3110] hover:to-[#2B5219] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                       </svg>
                       <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">3</span>
                     </div>
                     <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                       Cart (3 items)
                     </div>
                   </Link>
            <Link href="/login">
              <Button className="bg-[#2B5219] hover:bg-[#1a3110] text-white">
                Login
              </Button>
            </Link>
            <Link href="/logout">
              <Button className="bg-[#8B6D4D] hover:bg-[#725a40] text-white">
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
} 