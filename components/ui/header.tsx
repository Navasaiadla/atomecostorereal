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

          {/* Login/Logout */}
          <div className="flex items-center gap-4">
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