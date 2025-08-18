# Environment Variables Setup Guide

## 🚨 URGENT: Fix Button Issues

Your buttons are not working because the Supabase environment variables are missing! Follow these steps to fix it:

## Step 1: Create Environment File

1. **Create a new file** called `.env.local` in your project root (same folder as `package.json`)
2. **Add the following content** to the file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://grdxbgawbqhsndmdgxxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 2: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: "adlanava9390@gmail.com's Project"
3. **Go to Settings** → **API**
4. **Copy these values**:

### From the API Settings page:
- **Project URL**: `https://grdxbgawbqhsndmdgxxs.supabase.co` (already filled above)
- **anon public**: Copy this key and replace `your-anon-key-here`
- **service_role secret**: Copy this key and replace `your-service-role-key-here`

## Step 3: Update Your .env.local File

Replace the placeholder values with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://grdxbgawbqhsndmdgxxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
```

## Step 4: Restart Your Development Server

1. **Stop your current server** (Ctrl+C in terminal)
2. **Start it again**:
   ```bash
   npm run dev
   ```

## Step 5: Test the Fix

1. **Visit**: http://localhost:3001/debug-auth
2. **Check** if environment variables are now showing as "true"
3. **Test buttons** on login/register pages

## 🔧 Debug Page

Visit `/debug-auth` to check if your environment variables are working correctly.

## ✅ Expected Result

After setting up the environment variables:
- ✅ All buttons should work
- ✅ Login/Register forms should function
- ✅ Authentication should work properly
- ✅ No more "Supabase not configured" errors

## 🆘 If Still Not Working

1. **Check file location**: `.env.local` must be in the project root
2. **Check file name**: Must be exactly `.env.local` (not `.env` or `.env.local.txt`)
3. **Restart server**: Always restart after adding environment variables
4. **Check browser console**: Look for any JavaScript errors

## 📞 Need Help?

If you're still having issues:
1. Visit `/debug-auth` to see what's wrong
2. Check the browser console for errors
3. Make sure you copied the keys correctly from Supabase

---

**Once you've set up the environment variables, all your buttons should work perfectly!** 🎉 