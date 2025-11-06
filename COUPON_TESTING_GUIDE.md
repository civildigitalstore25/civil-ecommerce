# 🧪 Coupon Usage Tracking - Testing & Debugging Guide

## 📋 Current Issue
You mentioned that after completing a payment with a coupon, the order shows "Paid" status but the coupon usage count is not incrementing in the admin panel.

---

## ✅ What I've Added for Debugging

### Enhanced Console Logs in Payment Verification

When you make a payment now, you'll see these logs in the backend terminal:

```
🔔 Payment verification started
📦 Razorpay Order ID: order_xyz123
✅ Order found: ORD-ABC-DEF123
🎟️ Coupon code in order: NEW20 (or "None" if no coupon)
✅ Order status updated to processing
🎫 Processing coupon: NEW20
✅ Coupon NEW20 usage incremented: 1/1
🚫 Coupon NEW20 auto-deactivated - limit reached!
💾 Coupon NEW20 saved successfully
✅ Payment verified for order: ORD-ABC-DEF123
```

---

## 🧪 Step-by-Step Testing Instructions

### 1️⃣ **Prepare Test Coupon**
- Go to Admin Panel → Coupons
- Create a new coupon:
  - Code: `TEST50`
  - Name: `Test Offer`
  - Discount: 20% or any amount
  - Valid From: Today
  - Valid To: Tomorrow or later
  - **Usage Limit: 2** ← Important!
  - Status: Active
- You should see: **"Usage: 0/2"**

### 2️⃣ **Make First Test Purchase**
1. Open the website (make sure you're logged in)
2. Add any product to cart
3. Go to checkout
4. In the coupon field, enter: `TEST50`
5. Click **"Apply Coupon"**
   - ✅ You should see success message with discount applied
6. Fill in all required fields (Name, WhatsApp, Email)
7. Click **"Place Order"**
8. Complete Razorpay payment (use test mode)

### 3️⃣ **Check Backend Terminal**
After payment completion, look for these logs:

```bash
✅ Order created: ORD-... with coupon: TEST50
🔔 Payment verification started
📦 Razorpay Order ID: order_...
✅ Order found: ORD-...
🎟️ Coupon code in order: TEST50
✅ Order status updated to processing
🎫 Processing coupon: TEST50
✅ Coupon TEST50 usage incremented: 1/2
💾 Coupon TEST50 saved successfully
✅ Payment verified for order: ORD-...
```

### 4️⃣ **Check Admin Panel**
1. Go to Admin Panel → Coupons
2. Click the **🔄 Refresh** button
3. Find your `TEST50` coupon
4. You should now see: **"Usage: 1/2"** ✅

### 5️⃣ **Make Second Test Purchase**
1. Repeat steps 2-4 with a different account or same account
2. After second payment, check admin panel again
3. You should see: 
   - **"🚫 Usage: 2/2"** (in red, bold)
   - Status: **"Inactive"** (yellow badge)
   - Warning banner: "⚠️ Usage limit reached"

### 6️⃣ **Try Third Purchase (Should Fail)**
1. Try to apply `TEST50` again at checkout
2. You should see error: **"Coupon validity expired - usage limit reached"** ❌

---

## 🔍 Troubleshooting

### If Usage Count Doesn't Increment:

#### Check 1: Backend Logs
**Look for these specific messages in terminal:**

❌ **If you see:** `ℹ️ No coupon code in order`
- **Problem:** Coupon code is not being saved in the order
- **Solution:** Check if coupon code is being sent from frontend

❌ **If you see:** `❌ Coupon not found: TEST50`
- **Problem:** Coupon doesn't exist or wrong code
- **Solution:** Verify coupon exists and code matches exactly

❌ **If you see:** `⚠️ Coupon TEST50 is already Inactive`
- **Problem:** Coupon was already deactivated
- **Solution:** Create a new coupon or manually set status to Active

❌ **If you see:** `⚠️ Coupon TEST50 has reached usage limit`
- **Problem:** Usage count already at limit
- **Solution:** Increase usage limit or create new coupon

#### Check 2: Order Details
**In your Orders page or database, verify:**
- Order has `couponCode` field populated
- Order status is "processing" (not "pending")
- Payment status is "paid"

#### Check 3: Verify API Call
**Open browser DevTools (F12) → Network tab:**
1. Make a test payment
2. Look for POST request to `/api/payments/verify`
3. Check:
   - Request includes: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`
   - Response shows: `success: true`

---

## 🐛 Common Issues & Fixes

### Issue 1: "Order not found" Error
**Symptom:** Logs show `❌ Order not found for Razorpay Order ID: ...`

**Fix:**
- The Razorpay order ID doesn't match any order in database
- Check if order was created properly before payment
- Verify `razorpayOrderId` field in Order model

### Issue 2: Coupon Code Case Mismatch
**Symptom:** Logs show `❌ Coupon not found: test50`

**Fix:**
- Coupon codes are now stored in UPPERCASE
- Check if coupon exists as `TEST50` (not `test50`)
- The code automatically converts to uppercase, but verify in database

### Issue 3: Server Not Restarted
**Symptom:** No new logs appearing in terminal

**Fix:**
```bash
# Stop the current server (Ctrl+C)
cd backend
npm run dev
```

### Issue 4: Database Not Updated
**Symptom:** Logs show success but admin panel shows old data

**Fix:**
1. Click the **🔄 Refresh** button in admin panel
2. Or reload the admin page (F5)
3. Check MongoDB directly to verify coupon was updated

---

## 📊 Expected Log Flow (Complete Example)

```bash
# When order is created:
✅ Order created: ORD-LABC-XYZ123 for userId: 507f... with coupon: TEST50

# When payment is verified:
🔔 Payment verification started
📦 Razorpay Order ID: order_MnOP123
✅ Order found: ORD-LABC-XYZ123
🎟️ Coupon code in order: TEST50
✅ Order status updated to processing
🎫 Processing coupon: TEST50
✅ Coupon TEST50 usage incremented: 1/2
💾 Coupon TEST50 saved successfully
✅ Payment verified for order: ORD-LABC-XYZ123
```

---

## ✅ Success Criteria

After making a payment with coupon, you should see:

1. ✅ **Backend logs** show coupon processing
2. ✅ **Admin panel** shows incremented usage count (e.g., 1/2)
3. ✅ **When limit reached** (2/2), status becomes "Inactive"
4. ✅ **Red color & 🚫 emoji** appear when limit reached
5. ✅ **Cannot apply** the same coupon after limit

---

## 🔄 Quick Reset for Testing

To reset and test again:

1. **Reset coupon usage:**
   - Edit coupon in admin panel
   - Set `usedCount` back to 0
   - Set status back to "Active"
   - Save

2. **Or create a new coupon:**
   - Use a different code (e.g., `TEST51`, `TEST52`)
   - This avoids confusion

---

## 📞 What to Share If Still Not Working

If the issue persists after testing, please share:

1. **Complete backend logs** from terminal (copy the entire output after making payment)
2. **Screenshot** of the admin coupon panel
3. **Screenshot** of your order details showing:
   - Order status
   - Payment status
   - Coupon code (if visible)
4. **Browser console logs** (F12 → Console tab) during checkout

---

## 🎯 Expected Behavior Summary

| Action | Backend Log | Admin Panel Display |
|--------|------------|-------------------|
| Create coupon (limit=2) | - | **Usage: 0/2** |
| First payment | `✅ Coupon ... incremented: 1/2` | **Usage: 1/2** |
| Second payment | `✅ Coupon ... incremented: 2/2`<br>`🚫 Coupon ... auto-deactivated` | **🚫 Usage: 2/2** (red)<br>Status: Inactive |
| Try third time | - | Error: "Coupon validity expired" |

---

## 🚀 Ready to Test!

The backend server is now running with enhanced debugging logs. Please try making a test payment and watch the terminal logs to see what happens!
