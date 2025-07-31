# 🚨 IMMEDIATE SETUP REQUIRED - Razorpay Integration

## The Issue
Your Razorpay integration is not working because the API keys are not configured. Here's how to fix it:

## Step 1: Create Environment File
Create a file named `.env.local` in your project root (same folder as package.json) and add:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

## Step 2: Get Your Razorpay Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login to your account
3. Go to **Settings** → **API Keys**
4. Click **Generate Key Pair**
5. Copy the **Key ID** and **Key Secret**

## Step 3: Update Environment File
Replace the placeholder values in `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1234567890
```

## Step 4: Restart Your Server
Stop your development server (Ctrl+C) and restart it:
```bash
npm run dev
```

## Step 5: Test the Payment
1. Go to your checkout page
2. Fill in the form
3. Select "Online Payment (Razorpay)"
4. Click "Pay ₹269"
5. You should see the Razorpay payment modal

## Test Card Details
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## If You Still Have Issues
1. Check the browser console (F12) for error messages
2. Check the terminal where you're running `npm run dev` for server errors
3. Make sure the `.env.local` file is in the correct location
4. Ensure you've restarted the development server after adding the environment variables

## Quick Test
After setting up the keys, you can test if they're working by:
1. Opening browser console (F12)
2. Going to checkout page
3. Selecting Razorpay payment
4. Clicking "Pay ₹269"
5. Check console for any error messages

The integration will show helpful error messages if something is wrong with the configuration. 