# Cart System Setup Guide

This guide will help you set up the real cart system for your Atom Eco Store.

## Overview

The cart system has been completely rebuilt to use real database storage instead of dummy data. Here's what's been implemented:

### Features
- ✅ Real cart items stored in database
- ✅ User-specific cart (each user sees only their own items)
- ✅ Add to cart functionality from product pages and product grid
- ✅ Update quantities in cart
- ✅ Remove items from cart
- ✅ Real-time cart count in header
- ✅ Stock validation
- ✅ Loading states and error handling

### Database Structure

The `cart_items` table has the following structure:
```sql
cart_items (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## Setup Instructions

### 1. Create the Cart Table

You have two options to create the cart table:

#### Option A: Using the Setup Script (Recommended)
```bash
node scripts/setup-cart.js
```

#### Option B: Manual Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/create-cart-table.sql`
4. Execute the SQL

### 2. Verify Setup

After running the setup, you should see:
- ✅ `cart_items` table created in your database
- ✅ Row Level Security (RLS) enabled
- ✅ Policies configured for user access
- ✅ Indexes created for performance

### 3. Test the Cart System

1. **Login to your account** (cart functionality requires authentication)
2. **Browse products** and click "Add to Cart" on any product
3. **Check the cart icon** in the header - it should show the number of items
4. **Visit the cart page** (`/cart`) to see your items
5. **Test quantity updates** and item removal

## API Endpoints

The cart system uses these API endpoints:

- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update item quantity
- `DELETE /api/cart?cart_item_id=xxx` - Remove item from cart

## Components Updated

### 1. Cart Context (`lib/cart-context.tsx`)
- Manages cart state across the application
- Provides functions for cart operations
- Handles loading states and errors

### 2. Header Component (`components/ui/header.tsx`)
- Shows real cart count instead of dummy number
- Updates automatically when cart changes

### 3. Cart Page (`app/cart/page.tsx`)
- Displays real cart items from database
- Interactive quantity controls
- Remove item functionality
- Loading and error states

### 4. Product Detail Page (`app/products/[id]/page.tsx`)
- "Add to Cart" button with loading state
- Quantity selector
- Stock validation

### 5. Products Grid (`app/products/products-grid.tsx`)
- "Add to Cart" button on each product card
- Loading states for individual products

## Security Features

- **Row Level Security (RLS)** enabled on cart_items table
- **User-specific access** - users can only see their own cart items
- **Authentication required** - all cart operations require login
- **Input validation** - quantities must be positive, stock limits enforced

## Troubleshooting

### Cart Count Not Updating
- Make sure you're logged in
- Check browser console for errors
- Verify the cart API endpoints are working

### "Add to Cart" Not Working
- Ensure you're authenticated
- Check if the product exists and is active
- Verify stock quantity is available

### Database Errors
- Run the setup script again
- Check Supabase dashboard for table existence
- Verify RLS policies are correctly configured

## Migration from Dummy Data

The old dummy cart data has been completely removed. Users will now see:
- Empty cart when first visiting (if not logged in)
- Their actual cart items when logged in
- Real-time updates when adding/removing items

## Performance Considerations

- Cart data is cached in React context
- API calls are optimized with proper error handling
- Database indexes improve query performance
- RLS policies ensure efficient data access

## Next Steps

After setting up the cart system, you might want to:

1. **Add cart persistence** - save cart to localStorage for guest users
2. **Implement cart merging** - merge guest cart with user cart on login
3. **Add cart expiration** - automatically clear old cart items
4. **Cart sharing** - allow users to share cart links
5. **Bulk operations** - select multiple items for removal

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all environment variables are set correctly
4. Check the network tab for API call failures

The cart system is now fully functional with real database storage! 🎉

