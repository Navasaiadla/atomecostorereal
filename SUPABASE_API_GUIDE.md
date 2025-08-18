# 🔑 Supabase API Guide - How to Get Keys & Use APIs

## 📍 How to Get Your Supabase API Keys

### Step 1: Create Supabase Project
1. **Go to [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Click "New Project"**
3. **Fill in details:**
   - Organization: Select your org
   - Name: `atomecostore`
   - Database Password: Create strong password
   - Region: Choose closest to users

### Step 2: Get API Keys
1. **In your project dashboard, go to Settings → API**
2. **You'll see these keys:**

```
Project URL: https://your-project-id.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Copy all three values**

### Step 3: Add to Environment Variables
**Update your `.env.local` file:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Existing Razorpay variables
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

## 🚀 What the APIs Look Like

### 1. **Authentication APIs**

```typescript
import { auth } from '@/lib/supabase-utils'

// Sign Up
const { data, error } = await auth.signUp('user@example.com', 'password123', {
  full_name: 'John Doe',
  role: 'customer'
})

// Sign In
const { data, error } = await auth.signIn('user@example.com', 'password123')

// Sign Out
const { error } = await auth.signOut()

// Get Current User
const { user, error } = await auth.getCurrentUser()

// Get Current Session
const { session, error } = await auth.getCurrentSession()
```

### 2. **Product APIs**

```typescript
import { products } from '@/lib/supabase-utils'

// Get All Products
const { data, error } = await products.getAll()
// Returns: Product[] with category info

// Get Product by ID
const { data, error } = await products.getById('product-uuid')
// Returns: Product with category info

// Get Products by Seller
const { data, error } = await products.getBySeller('seller-uuid')
// Returns: Product[] for specific seller

// Create Product
const { data, error } = await products.create({
  name: 'Bamboo Cup',
  description: 'Eco-friendly bamboo cup',
  price: 299.99,
  sale_price: 249.99,
  images: ['https://example.com/image1.jpg'],
  category_id: 'category-uuid',
  seller_id: 'seller-uuid',
  stock_quantity: 100,
  is_active: true
})

// Update Product
const { data, error } = await products.update('product-uuid', {
  price: 349.99,
  stock_quantity: 50
})

// Delete Product
const { error } = await products.delete('product-uuid')
```

### 3. **Cart APIs**

```typescript
import { cart } from '@/lib/supabase-utils'

// Get User's Cart Items
const { data, error } = await cart.getItems('customer-uuid')
// Returns: CartItem[] with product info

// Add Item to Cart
const { data, error } = await cart.addItem({
  customer_id: 'customer-uuid',
  product_id: 'product-uuid',
  quantity: 2
})

// Update Cart Item Quantity
const { data, error } = await cart.updateQuantity('cart-item-uuid', 3)

// Remove Item from Cart
const { error } = await cart.removeItem('cart-item-uuid')

// Clear User's Cart
const { error } = await cart.clearCart('customer-uuid')
```

### 4. **Order APIs**

```typescript
import { orders } from '@/lib/supabase-utils'

// Get User's Orders
const { data, error } = await orders.getUserOrders('customer-uuid')
// Returns: Order[] with order items and products

// Get Seller's Orders
const { data, error } = await orders.getSellerOrders('seller-uuid')
// Returns: Order[] for seller's products

// Create Order
const { data, error } = await orders.create({
  customer_id: 'customer-uuid',
  total_amount: 599.98,
  status: 'pending',
  payment_status: 'pending',
  shipping_address: {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001'
  },
  billing_address: {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001'
  },
  razorpay_order_id: 'order_123456'
})

// Update Order Status
const { data, error } = await orders.updateStatus('order-uuid', 'shipped')

// Update Payment Status
const { data, error } = await orders.updatePaymentStatus(
  'order-uuid', 
  'paid', 
  'pay_123456'
)
```

### 5. **Profile APIs**

```typescript
import { profiles } from '@/lib/supabase-utils'

// Get User Profile
const { data, error } = await profiles.getProfile('user-uuid')
// Returns: Profile

// Update Profile
const { data, error } = await profiles.updateProfile('user-uuid', {
  full_name: 'Jane Doe',
  avatar_url: 'https://example.com/avatar.jpg'
})

// Create Profile
const { data, error } = await profiles.createProfile({
  id: 'user-uuid',
  email: 'user@example.com',
  full_name: 'John Doe',
  role: 'customer'
})
```

## 🔧 Direct Supabase Client Usage

You can also use the Supabase client directly:

```typescript
import { supabase } from '@/lib/supabase'

// Direct database queries
const { data, error } = await supabase
  .from('products')
  .select('*, categories(*)')
  .eq('is_active', true)
  .order('created_at', { ascending: false })

// Real-time subscriptions
const subscription = supabase
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Product changed:', payload)
    }
  )
  .subscribe()

// File storage
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('bamboo-cup.jpg', file)

// Get public URL
const { data } = supabase.storage
  .from('product-images')
  .getPublicUrl('bamboo-cup.jpg')
```

## 📊 API Response Structure

### Success Response
```typescript
{
  data: [
    {
      id: "uuid",
      name: "Bamboo Cup",
      price: 299.99,
      // ... other fields
    }
  ],
  error: null
}
```

### Error Response
```typescript
{
  data: null,
  error: {
    message: "Error message",
    code: "PGRST116",
    details: "Additional details"
  }
}
```

## 🛡️ Row Level Security (RLS)

Your APIs are protected by RLS policies:

- **Customers** can only see their own orders, cart items, and profile
- **Sellers** can only manage their own products
- **Public** can view active products and categories
- **Admins** have full access (using service role key)

## 🔍 Error Handling

```typescript
import { handleSupabaseError } from '@/lib/supabase-utils'

// In your components
const { data, error } = await products.getAll()

if (error) {
  const errorMessage = handleSupabaseError(error)
  console.error('Error:', errorMessage)
  // Show user-friendly error message
}
```

## 🧪 Testing Your APIs

Create a test page to verify your setup:

```typescript
// app/test-supabase/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { auth, products } from '@/lib/supabase-utils'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        // Test authentication
        const { user } = await auth.getCurrentUser()
        console.log('Current user:', user)

        // Test products
        const { data, error } = await products.getAll()
        if (error) throw error
        
        setStatus(`✅ Connected! Found ${data?.length || 0} products`)
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <p>{status}</p>
    </div>
  )
}
```

## 🎯 Next Steps

1. **Set up your Supabase project** and get API keys
2. **Add environment variables** to `.env.local`
3. **Create database tables** using the SQL from setup guide
4. **Test the connection** using the test page
5. **Start integrating** APIs into your existing components

Your Supabase APIs are now ready to power your e-commerce application! 🚀 