# 🎯 Reviews System Guide

This guide covers the complete reviews system implementation for the AtomecoStore e-commerce platform.

## 📋 Overview

The reviews system allows customers to:
- ✅ Rate products (1-5 stars)
- ✅ Write review titles and comments
- ✅ See verified purchase badges
- ✅ Edit and delete their own reviews
- ✅ View all reviews for products
- ✅ See average ratings and review counts

## 🗄️ Database Schema

### Reviews Table Structure

```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, customer_id)
);
```

### Key Features

- **Unique constraint**: One review per customer per product
- **Rating validation**: 1-5 stars only
- **Verified purchases**: Automatic detection based on order history
- **Timestamps**: Automatic creation and update tracking
- **Cascading deletes**: Reviews deleted when product or user is deleted

## 🚀 Setup Instructions

### 1. Create the Reviews Table

Run the setup script:

```bash
node scripts/setup-reviews.js
```

Or manually execute the SQL in your Supabase dashboard:

```sql
-- Copy the contents of scripts/create-reviews-table.sql
```

### 2. Verify Setup

Check that the table was created successfully:

```bash
# Test the reviews API
curl http://localhost:3000/api/reviews?productId=test-product-123
```

### 3. Test the System

Visit the test page to verify functionality:

```
http://localhost:3000/test-reviews
```

## 🔌 API Endpoints

### Get Reviews

```http
GET /api/reviews?productId={productId}&customerId={customerId}
```

**Response:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "customer_id": "uuid",
      "rating": 5,
      "title": "Great product!",
      "comment": "Really happy with this purchase.",
      "is_verified_purchase": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "profiles": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### Create Review

```http
POST /api/reviews
Content-Type: application/json

{
  "productId": "uuid",
  "rating": 5,
  "title": "Great product!",
  "comment": "Really happy with this purchase."
}
```

### Update Review

```http
PUT /api/reviews/{reviewId}
Content-Type: application/json

{
  "rating": 4,
  "title": "Updated title",
  "comment": "Updated comment"
}
```

### Delete Review

```http
DELETE /api/reviews/{reviewId}
```

## 🎨 Frontend Components

### Reviews Component

The main reviews component is located at `components/ui/reviews.tsx` and provides:

- **Review display**: Shows all reviews with ratings, titles, comments
- **Review form**: Allows users to write/edit reviews
- **User review management**: Edit/delete own reviews
- **Verified purchase badges**: Shows for users who bought the product
- **Average rating calculation**: Automatic calculation and display

### Usage in Product Pages

```tsx
import { Reviews } from '@/components/ui/reviews'

// In your product detail page
<Reviews productId={productId} productName={productName} />
```

## 🔐 Security & Permissions

### Row Level Security (RLS)

The reviews table has RLS enabled with these policies:

- **View**: Anyone can view all reviews
- **Create**: Users can only create reviews for themselves
- **Update**: Users can only update their own reviews
- **Delete**: Users can only delete their own reviews

### Authentication Required

- Creating, updating, and deleting reviews requires authentication
- Reviews are automatically linked to the authenticated user
- Unauthenticated users can only view reviews

## 🎯 Features

### Verified Purchase Badges

Reviews automatically show "Verified Purchase" badges for users who:
- Have purchased the product
- Have a delivered order status

### Rating System

- **5-star rating system**: 1-5 stars with visual star display
- **Average calculation**: Automatic calculation of product average ratings
- **Review count**: Total number of reviews displayed

### User Experience

- **One review per product**: Users can only review each product once
- **Edit functionality**: Users can edit their existing reviews
- **Delete functionality**: Users can delete their reviews
- **Real-time updates**: Reviews update immediately after submission

## 🧪 Testing

### Test Page

Visit `/test-reviews` to test the reviews system:

- Create test reviews
- View existing reviews
- Test authentication requirements
- Verify API functionality

### Manual Testing

1. **Login** to your account
2. **Navigate** to any product page
3. **Write a review** using the review form
4. **Verify** the review appears in the reviews list
5. **Test editing** and deleting your review

## 🔧 Troubleshooting

### Common Issues

1. **Reviews not showing**: Check if the reviews table exists and has data
2. **Authentication errors**: Ensure user is logged in
3. **Permission denied**: Check RLS policies are correctly configured
4. **API errors**: Check browser console and server logs

### Debug Steps

1. **Check database**: Verify reviews table exists and has correct structure
2. **Test API**: Use the test page or curl commands
3. **Check authentication**: Ensure user is properly authenticated
4. **Review logs**: Check browser console and server logs for errors

## 📊 Analytics

### Review Statistics

The system automatically calculates:
- Average rating per product
- Total review count per product
- Rating distribution
- Verified purchase percentage

### Performance

- **Indexed queries**: Fast retrieval with proper database indexes
- **Pagination support**: Can be added for large review lists
- **Caching**: Reviews can be cached for better performance

## 🎨 Styling

The reviews component uses Tailwind CSS classes and matches the existing design system:

- **Color scheme**: Uses the existing green theme (`#2B5219`)
- **Typography**: Consistent with the rest of the application
- **Spacing**: Follows the existing spacing patterns
- **Responsive**: Mobile-first responsive design

## 🔄 Future Enhancements

Potential improvements for the reviews system:

1. **Review moderation**: Admin approval for reviews
2. **Review helpfulness**: Upvote/downvote system
3. **Review photos**: Allow users to upload photos with reviews
4. **Review analytics**: Detailed analytics dashboard
5. **Review notifications**: Email notifications for new reviews
6. **Review search**: Search and filter reviews
7. **Review export**: Export reviews for analysis

## 📞 Support

For issues or questions about the reviews system:

1. Check this guide first
2. Review the test page at `/test-reviews`
3. Check the browser console for errors
4. Review server logs for API errors
5. Verify database setup and permissions































