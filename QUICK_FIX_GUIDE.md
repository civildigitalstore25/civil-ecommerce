# 🚀 Quick Deployment Fix Guide

## What Was Broken? 🔴

1. ❌ **Proceed to Checkout** - Not working
2. ❌ **Coupon Validation** - Failing to connect
3. ❌ **Razorpay Payment** - Not initializing

## Root Cause 🎯

**Wrong environment variable name in code!**

- `.env` has: `VITE_API_BASE_URL`
- Code used: `VITE_API_URL` 
- Result: Falls back to `localhost:5000` ❌

## What Was Fixed ✅

### File: `frontend/src/pages/CheckoutPage.tsx`

Changed **5 instances** from:
```typescript
VITE_API_URL
```
to:
```typescript
VITE_API_BASE_URL
```

### File: `backend/server.ts`

Fixed CORS to support multiple origins properly.

## Deploy Now! 🚀

```bash
# 1. Commit changes
git add .
git commit -m "fix: API URL configuration for live deployment"
git push origin main

# 2. Wait 5-10 minutes for Vercel + Render to deploy

# 3. Test on live site
```

## Quick Test ✅

1. Open your live site
2. Add product to cart
3. Click "Proceed to Checkout"
4. Fill details and click "Place Order"
5. ✅ Razorpay modal should open!

## If Still Not Working 🔍

1. **Check Vercel Environment Variables**:
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Ensure `VITE_API_BASE_URL=https://civil-ecommerce-uimk.onrender.com`
   - Redeploy if needed

2. **Check Browser Console (F12)**:
   - Should NOT see `localhost:5000` in network calls
   - Should see `civil-ecommerce-uimk.onrender.com`

3. **Clear Browser Cache**:
   - Hard refresh: `Ctrl+Shift+R`

## Environment Variables Checklist 📋

### Vercel (Frontend):
```
✅ VITE_API_BASE_URL=https://civil-ecommerce-uimk.onrender.com
```

### Render (Backend):
```
✅ FRONTEND_URL=https://civil-ecommerce-yiav.vercel.app
✅ MONGODB_URI=mongodb+srv://...
✅ RAZORPAY_KEY_ID=rzp_test_...
✅ RAZORPAY_KEY_SECRET=...
✅ JWT_SECRET=...
```

---

**That's it!** Your checkout should work now. 🎉
