"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Settings, User, Store, Bell, Shield } from "lucide-react"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    store_name: "Atom Eco Store",
    email: "seller@example.com",
    phone: "+91 98765 43210",
    address: "123 Green Street, Eco City, India",
    bio: "We specialize in eco-friendly products that help protect our planet."
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert("Settings saved successfully!")
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/seller/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and store settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium text-gray-900 mb-4">Settings</h3>
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 bg-green-50 rounded-md">
                <User className="h-4 w-4" />
                Profile
              </a>
              <a href="#store" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Store className="h-4 w-4" />
                Store Settings
              </a>
              <a href="#notifications" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Bell className="h-4 w-4" />
                Notifications
              </a>
              <a href="#security" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <Shield className="h-4 w-4" />
                Security
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div id="profile" className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="store_name">Store Name</Label>
                <Input
                  id="store_name"
                  name="store_name"
                  value={profileData.store_name}
                  onChange={handleInputChange}
                  placeholder="Your store name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Your store address"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Store Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell customers about your store"
                />
              </div>
            </div>
          </div>

          {/* Store Settings */}
          <div id="store" className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Store className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Store Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Store Status</h3>
                  <p className="text-sm text-gray-600">Make your store visible to customers</p>
                </div>
                <Button variant="outline" size="sm">
                  Active
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Auto-approve Orders</h3>
                  <p className="text-sm text-gray-600">Automatically approve new orders</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified when products are low in stock</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div id="notifications" className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">New Order Notifications</h3>
                  <p className="text-sm text-gray-600">Get notified when you receive new orders</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Button variant="outline" size="sm">
                  Enabled
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <Button variant="outline" size="sm">
                  Disabled
                </Button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 