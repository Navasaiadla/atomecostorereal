# 🔧 Vercel Razorpay Deployment Checklist

## ✅ Environment Variables in Vercel Dashboard

Make sure these are set in your Vercel project settings:

### Required Variables:
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

### Important Notes:
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` must start with `rzp_`
- `RAZORPAY_KEY_SECRET` should be your actual secret key (not placeholder)
- Both `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID` should be the same value

## 🔍 Debugging Steps

### 1. Test Environment Variables
Visit: `https://your-domain.vercel.app/debug/razorpay`

This will show you:
- ✅ Client-side key validation
- ✅ Server-side key validation
- ✅ Order creation test

### 2. Check Browser Console
Open browser dev tools and look for:
```javascript
console.log('Client Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
console.log('Starting payment process...')
console.log('Order data:', orderData)
```

### 3. Check Vercel Function Logs
In Vercel dashboard → Functions → Check logs for:
- Order creation API calls
- Payment verification API calls
- Any error messages

## 🚨 Common Issues & Solutions

### Issue 1: "Payment Failed" immediately
**Cause:** Invalid or missing environment variables
**Solution:** 
1. Verify all env vars are set in Vercel
2. Ensure keys are not placeholder values
3. Check that `NEXT_PUBLIC_RAZORPAY_KEY_ID` starts with `rzp_`

### Issue 2: Order creation fails
**Cause:** Server-side API keys not configured
**Solution:**
1. Verify `RAZORPAY_KEY_SECRET` is set
2. Check `RAZORPAY_KEY_ID` matches your public key
3. Ensure keys are not default placeholder values

### Issue 3: Payment verification fails
**Cause:** Signature verification mismatch
**Solution:**
1. Ensure `RAZORPAY_KEY_SECRET` is correct
2. Check that the same key pair is used for order creation and verification

## 🧪 Testing Steps

### Step 1: Environment Test
```bash
# Visit your debug page
https://your-domain.vercel.app/debug/razorpay
```

### Step 2: Order Creation Test
Click "Test Order Creation" button to verify:
- ✅ API keys are working
- ✅ Order is created successfully
- ✅ Response contains valid order ID

### Step 3: Payment Flow Test
1. Go to checkout page
2. Select Razorpay payment
3. Click "Pay" button
4. Check browser console for logs
5. Monitor Vercel function logs

## 📋 Pre-Deployment Checklist

- [ ] Environment variables set in Vercel dashboard
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` starts with `rzp_`
- [ ] `RAZORPAY_KEY_SECRET` is actual secret key
- [ ] Both key IDs match (public and server)
- [ ] Test order creation works
- [ ] Payment flow works locally
- [ ] Debug page shows all green checkmarks

## 🔧 Quick Fixes

### If keys are not working:
1. Double-check Razorpay dashboard for correct keys
2. Ensure you're using test keys for testing
3. Verify no extra spaces in environment variables
4. Redeploy after changing environment variables

### If payment still fails:
1. Check browser console for detailed error logs
2. Monitor Vercel function logs
3. Use debug page to isolate the issue
4. Verify Razorpay account is active and not in test mode

## 📞 Support

If issues persist:
1. Check Razorpay dashboard for account status
2. Verify webhook URLs if configured
3. Contact Razorpay support with error details
4. Share Vercel function logs for debugging 