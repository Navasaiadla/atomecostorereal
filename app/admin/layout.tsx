"use client"

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Settings, 
  Users,
  Store,
  Shield,
  LogOut,
  Bell,
  TrendingUp,
  FileText,
  Globe,
  Menu,
  X,
  User
} from 'lucide-react';
import { AdminGuard } from '@/components/admin/admin-guard';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Sellers', href: '/admin/sellers', icon: Store },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    // Temporarily redirect to home page
    // TODO: Re-enable Supabase logout when authentication is added back
    window.location.href = '/';
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Navigation Bar (single header only) */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo2.png" alt="Atom Eco Store" width={150} height={52} className="h-12 w-auto" />
              </Link>
              <span className="hidden md:inline-block text-sm text-gray-400">/</span>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="text-gray-600 hover:text-gray-800 relative p-2">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">3</span>
              </button>
              <Link href="/" className="hidden sm:block">
                <Button size="sm" variant="outline">View Store</Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Admin</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shrink-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <Image 
                src="/logo2.png"
                alt="Atom Eco Store"
                width={120}
                height={45}
                className="h-8 w-auto"
              />
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <nav className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                  Admin Menu
                </h2>
                
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name}
                      href={item.href} 
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-green-100 text-green-700 border-r-2 border-green-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t border-gray-200 lg:hidden">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Footer removed to avoid duplication with global footer */}
      </div>
      <Toaster />
    </AdminGuard>
  );
} 