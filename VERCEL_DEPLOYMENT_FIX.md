# Fix for "window.Razorpay is not a constructor" on Vercel

## Problem
The error "window.Razorpay is not a constructor" occurs on Vercel deployment but works fine locally. This happens because:

1. **Script Loading Timing**: Vercel's production environment has different script loading timing
2. **CDN Issues**: Razorpay script might not load properly in production
3. **Environment Variables**: Keys might not be properly configured in Vercel

## Solution Applied ✅

### 1. Fixed Script Loading Strategy
**Changed from `beforeInteractive` to `afterInteractive`** in `app/layout.tsx`:
```tsx
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"  // Changed from beforeInteractive
  id="razorpay-script"
/>
```

**Note**: Removed `onLoad` and `onError` handlers as they cannot be used in server components.

### 2. Enhanced Script Detection
**Improved polling mechanism** in `components/ui/razorpay-button.tsx`:
- Increased retry attempts from 10 to 20
- Increased polling interval from 100ms to 200ms
- Added 1-second wait before throwing error
- Enhanced constructor error handling
- Added detailed console logging for debugging

### 3. Vercel Environment Variables Setup

#### Step 1: Add Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_key_secret
```

#### Step 2: Redeploy
After adding environment variables, redeploy your project:
```bash
git add .
git commit -m "Fix Razorpay deployment issue"
git push
```

### 4. Alternative Script Loading Method

If the issue persists, try this alternative approach in `app/layout.tsx`:

```tsx
<Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="lazyOnload"
  id="razorpay-script"
/>
```

### 5. Debug Steps

#### Check Environment Variables
Add this to your checkout page temporarily:
```tsx
console.log('Client Key ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
console.log('Key configured:', !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
```

#### Check Script Loading
Open browser console and look for:
- "🔄 Waiting for Razorpay script to load..."
- "✅ Razorpay constructor is available"
- "⏳ Retry X/20: Waiting for Razorpay..."
- Any error messages

### 6. Common Vercel Issues & Solutions

#### Issue 1: Environment Variables Not Loading
**Solution**: Make sure to redeploy after adding environment variables

#### Issue 2: Script Loading Too Early
**Solution**: Use `afterInteractive` or `lazyOnload` strategy

#### Issue 3: CDN Blocking
**Solution**: Check if your Vercel region has access to Razorpay CDN

### 7. Production Checklist

- [ ] Environment variables added to Vercel
- [ ] Script loading strategy changed to `afterInteractive`
- [ ] Enhanced error handling implemented
- [ ] Project redeployed after changes
- [ ] Tested with actual Razorpay keys

### 8. Testing in Production

1. **Test Script Loading**:
   ```javascript
   // In browser console
   console.log('Razorpay available:', typeof window.Razorpay)
   console.log('Razorpay constructor:', typeof window.Razorpay === 'function')
   ```

2. **Test Payment Flow**:
   - Use test card: 4111 1111 1111 1111
   - Check console for any errors
   - Verify payment completion

### 9. If Issue Persists

#### Option 1: Manual Script Loading
Add this to your checkout page:
```tsx
useEffect(() => {
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.async = true
  script.onload = () => console.log('Manual script loaded')
  document.head.appendChild(script)
}, [])
```

#### Option 2: Use Different CDN
Try loading from a different CDN:
```tsx
<Script
  src="https://cdn.razorpay.com/checkout.js"
  strategy="afterInteractive"
/>
```

## Files Modified
- `app/layout.tsx` - Changed script loading strategy, removed event handlers
- `components/ui/razorpay-button.tsx` - Enhanced error handling and retry logic with better logging

## Key Changes
1. **Script Strategy**: `beforeInteractive` → `afterInteractive`
2. **Event Handlers**: Removed `onLoad` and `onError` (not allowed in server components)
3. **Retry Logic**: Increased attempts and intervals
4. **Error Handling**: Better constructor error catching
5. **Logging**: Added detailed console logs for debugging
6. **Environment Setup**: Proper Vercel environment variables

The deployment should now work correctly on Vercel! 🚀 