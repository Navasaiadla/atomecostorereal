'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './button'
import { SearchBar } from './search-bar'
import { UserMenu } from '@/components/auth/user-menu'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems } = useCart()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-8">
            <Image 
              src="/logo2.png" 
              alt="Atom Eco Store" 
              width={180}
              height={60}
              className="h-20 w-auto"
            />
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-4xl">
            <SearchBar />
          </div>

          {/* Cart, Language, and User Menu */}
          <div className="flex items-center gap-4">
            {/* Cart - First */}
            <Link href="/cart" className="relative group">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-800 transition-transform duration-300 hover:scale-105 hover:text-[#2B5219] shadow-sm">
                {/* Unified cart/bag icon */}
                <img src="/cart-removebg-preview.png" alt="Cart" className="w-7 h-7" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">{totalItems}</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Cart ({totalItems} items)
              </div>
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <select
                aria-label="Language"
                defaultValue={(typeof window !== 'undefined' && localStorage.getItem('lang')) || 'en'}
                onChange={(e) => {
                  const lang = e.target.value
                  try { localStorage.setItem('lang', lang) } catch {}
                  // Navigate to the chosen auth page if open, not always login
                  const path = window.location.pathname
                  // Keep current path; if user explicitly clicked Register link, it will go to /register
                  window.location.assign(path)
                }}
                className="h-9 min-w-[96px] pr-8 pl-4 rounded-full border border-gray-300 bg-white text-sm text-gray-800 shadow hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* User Menu - Third */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          {/* Top Row - Logo, Search Icon, Cart, Menu */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image 
                src="/logo2.png" 
                alt="Atom Eco Store" 
                width={150}
                height={52}
                className="h-16 w-auto"
              />
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Search Icon */}
              <button 
                onClick={toggleSearch}
                className="p-2 text-gray-600 hover:text-[#2B5219] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart - Moved to the end */}
              <Link href="/cart" className="relative p-2">
                <div className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                  <img src="/cart-removebg-preview.png" alt="Cart" className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems}</span>
              </Link>

              {/* Hamburger Menu */}
              <button 
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-[#2B5219] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
            {isSearchOpen && (
              <div className="mt-3">
                <SearchBar small />
              </div>
            )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="py-2">
                <Link 
                  href="/sell-here" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2B5219] transition-colors border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-medium">Sell Here</span>
                  </div>
                </Link>
                <Link 
                  href="/register" 
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2B5219] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="font-medium">Sign Up</span>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 