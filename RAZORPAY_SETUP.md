# Razorpay Integration Setup Guide

## Prerequisites

1. **Razorpay Account**: Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. **Node.js**: Make sure you have Node.js installed
3. **Razorpay Package**: Install the Razorpay package

## Installation

1. Install the Razorpay package:
```bash
npm install razorpay
```

## Environment Variables Setup

Create a `.env.local` file in your project root and add the following variables:

```env
# Razorpay Configuration
# Get these from your Razorpay Dashboard: https://dashboard.razorpay.com/

# Your Razorpay Key ID (Public Key)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Your Razorpay Key Secret (Private Key - Keep this secret!)
RAZORPAY_KEY_SECRET=your_key_secret_here

# Note: For production, use live keys instead of test keys
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_live_key_id_here
# RAZORPAY_KEY_SECRET=your_live_key_secret_here
```

## Getting Your Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign in to your account
3. Go to **Settings** → **API Keys**
4. Generate a new key pair
5. Copy the **Key ID** and **Key Secret**
6. Replace the placeholder values in your `.env.local` file

## Testing the Integration

1. Start your development server:
```bash
npm run dev
```

2. Navigate to the checkout page
3. Fill in the shipping information
4. Select "Online Payment (Razorpay)" as payment method
5. Click "Pay ₹269" to test the payment

## Test Card Details

For testing, you can use these test card details:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## Production Deployment

Before going live:

1. Switch to live keys in your environment variables
2. Update the Razorpay configuration in your dashboard
3. Test thoroughly with small amounts
4. Ensure proper error handling and logging

## Features Implemented

- ✅ Razorpay order creation
- ✅ Payment processing
- ✅ Payment verification
- ✅ Success/failure handling
- ✅ Customer information pre-filling
- ✅ Responsive payment modal
- ✅ Error handling and validation

## API Endpoints

- `POST /api/payment/create-order` - Creates a new Razorpay order
- `POST /api/payment/verify` - Verifies payment signature

## Components

- `RazorpayButton` - Reusable payment button component
- Updated checkout page with payment integration

## Security Notes

- Never expose your `RAZORPAY_KEY_SECRET` in client-side code
- Always verify payment signatures on the server
- Use HTTPS in production
- Implement proper error handling and logging 