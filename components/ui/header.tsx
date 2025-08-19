'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './button'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { SearchBar } from './search-bar'
import { UserMenu } from '@/components/auth/user-menu'
import { useCart } from '@/lib/cart-context'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      try { await fetch('/api/auth/signout', { method: 'POST', cache: 'no-store' }) } catch {}
      router.push('/')
    } catch {}
    setIsMenuOpen(false)
  }

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
            <SearchBar variant="dark" />
          </div>

          {/* Cart, Sell Here, and User Menu */}
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

            {/* Desktop-only Sell Here button */}
            <Link href="/sell-here" className="hidden lg:inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-semibold" style={{ backgroundColor: '#8B4513' }}>
                Sell Here
              </span>
            </Link>

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
                <SearchBar small variant="dark" />
              </div>
            )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-3 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="py-2">
                {!user ? (
                  <>
                    <Link 
                      href="/login" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2B5219] transition-colors border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="font-medium">Login</span>
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
                  </>
                ) : (
                  <>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2B5219] transition-colors border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">My Profile</span>
                      </div>
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2B5219] transition-colors border-b border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M9 7h12M3 11h18M9 15h12M3 19h18" />
                        </svg>
                        <span className="font-medium">My Orders</span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        </svg>
                        <span className="font-medium">Sign Out</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 