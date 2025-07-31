# 🔧 FIX: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## The Problem
You're getting this error because the Razorpay API keys are not configured properly. The server is returning an HTML error page instead of JSON.

## Step 1: Check Your Environment Variables
First, let's test if your environment variables are loaded correctly:

1. **Visit this URL in your browser:**
   ```
   http://localhost:3001/api/test-env
   ```

2. **You should see JSON output like this:**
   ```json
   {
     "hasKeyId": true,
     "hasKeySecret": true,
     "hasPublicKeyId": true,
     "keyIdLength": 32,
     "keySecretLength": 32,
     "publicKeyIdLength": 32,
     "keyIdStartsWith": true,
     "publicKeyIdStartsWith": true,
     "isDefaultKeyId": false,
     "isDefaultKeySecret": false,
     "isDefaultPublicKeyId": false
   }
   ```

## Step 2: Create/Update .env.local File
If the test shows `isDefaultKeyId: true` or `hasKeyId: false`, you need to create/update your `.env.local` file:

1. **Create a file named `.env.local`** in your project root (same folder as `package.json`)

2. **Add your actual Razorpay keys:**
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_KEY_ID_HERE
   RAZORPAY_KEY_SECRET=YOUR_ACTUAL_KEY_SECRET_HERE
   ```

## Step 3: Get Your Razorpay Keys
If you don't have Razorpay keys yet:

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/Login
3. Go to **Settings** → **API Keys**
4. Click **Generate Key Pair**
5. Copy the **Key ID** and **Key Secret**

## Step 4: Restart Your Server
After updating `.env.local`:

1. **Stop your server** (Ctrl+C in terminal)
2. **Restart it:**
   ```bash
   npm run dev
   ```

## Step 5: Test Again
1. Visit `http://localhost:3001/api/test-env` again
2. Make sure all values are correct
3. Try the payment again

## Example of Correct .env.local
```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcdef1234567890abcdef1234567890
```

## Common Issues & Solutions

### Issue 1: "isDefaultKeyId: true"
**Solution:** Replace the placeholder values with your actual Razorpay keys

### Issue 2: "hasKeyId: false"
**Solution:** Make sure `.env.local` file exists and is in the correct location

### Issue 3: "keyIdStartsWith: false"
**Solution:** Make sure your key starts with `rzp_test_` (for test mode) or `rzp_live_` (for production)

### Issue 4: Server not restarting
**Solution:** 
1. Stop the server completely (Ctrl+C)
2. Wait a few seconds
3. Run `npm run dev` again

## Test the Payment
After fixing the environment variables:

1. Go to your checkout page
2. Fill in the form
3. Select "Online Payment (Razorpay)"
4. Click "Pay ₹269"
5. You should see the Razorpay payment modal

## If Still Not Working
1. Check the browser console (F12) for specific error messages
2. Check the terminal for server errors
3. Make sure you've restarted the server after adding environment variables
4. Verify the `.env.local` file is not in `.gitignore` (it should be, but make sure it exists) 