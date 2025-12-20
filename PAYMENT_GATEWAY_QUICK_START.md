# 🚀 Quick Start Guide - Dual Payment Gateway

## Prerequisites
- MongoDB running locally or connection string ready
- Node.js installed (v16 or higher)
- Razorpay test account credentials
- PhonePe test account credentials

## 🔧 Setup Instructions

### 1. Environment Configuration

Ensure your `.env` file in the backend directory has:

```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:5174

# Database
MONGODB_URI=mongodb://localhost:27017/Ecommerce

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_RZluwINAXPlYwm
RAZORPAY_KEY_SECRET=L7JbnpW7SgJ4SiSF51E0X1w2

# PhonePe
PHONEPE_CLIENT_ID=M23KEPPO36DNV_2512182205
PHONEPE_CLIENT_SECRET=ODdkOWY4NDItNGFkZS00YmJhLWFhNTctYzJhOWVlOGYxOWZl

# Email (for order notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=admin@yourdomain.com
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🧪 Testing Payment Gateways

### Test Razorpay Payment

1. Navigate to `http://localhost:5174`
2. Add products to cart
3. Go to checkout
4. Fill in billing details
5. Click "PLACE ORDER"
6. Select "Pay with Razorpay"
7. Use test credentials:
   - **Card**: 4111 1111 1111 1111
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits
   - **OTP**: 123456

### Test PhonePe Payment

1. Navigate to `http://localhost:5174`
2. Add products to cart
3. Go to checkout
4. Fill in billing details
5. Click "PLACE ORDER"
6. Select "Pay with PhonePe"
7. You'll be redirected to PhonePe sandbox
8. Complete payment (sandbox allows test payments)
9. You'll be redirected back to callback page
10. Order status will be updated automatically

## 🎯 Features to Test

### ✅ Razorpay Flow
- [ ] Order creation
- [ ] Razorpay modal opens
- [ ] Payment success handling
- [ ] Cart clears after payment
- [ ] Order appears in "My Orders"
- [ ] Order status shows "Processing"
- [ ] Payment status shows "Paid"

### ✅ PhonePe Flow
- [ ] Order creation
- [ ] Redirect to PhonePe
- [ ] Payment completion
- [ ] Redirect back to callback page
- [ ] Payment verification
- [ ] Cart clears after success
- [ ] Order appears in "My Orders"
- [ ] Order status shows "Processing"
- [ ] Payment status shows "Paid"

### ✅ Error Handling
- [ ] Payment cancellation (Razorpay)
- [ ] Payment failure
- [ ] Network errors
- [ ] Invalid credentials
- [ ] Unauthorized access

## 📊 Monitoring

### Check Backend Logs
The backend logs will show:
- ✅ Order creation
- 📱 PhonePe payment creation
- 💳 Razorpay order creation
- 🔍 Payment verification
- ✅ Order status updates
- 📧 Email notifications

### Check Frontend Console
The frontend console will show:
- 📦 Order payload
- ✅ Order creation response
- 💳 Payment gateway selection
- 🔍 Payment verification status

## 🗄️ Database Verification

Connect to MongoDB and check:

```javascript
// Find orders with payment gateway info
db.orders.find({}).sort({createdAt: -1}).pretty()

// Check Razorpay orders
db.orders.find({paymentGateway: "razorpay"}).pretty()

// Check PhonePe orders
db.orders.find({paymentGateway: "phonepe"}).pretty()

// Check paid orders
db.orders.find({paymentStatus: "paid"}).pretty()
```

## 🔍 Troubleshooting

### Issue: Razorpay modal doesn't open
**Solution**: Check browser console for Razorpay script loading errors

### Issue: PhonePe redirect fails
**Solution**: 
- Verify PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET
- Check backend logs for API errors
- Ensure callback URL is correct

### Issue: Payment verification fails
**Solution**:
- For Razorpay: Check signature verification in backend logs
- For PhonePe: Check transaction ID in session storage
- Verify environment variables are loaded

### Issue: Order not created
**Solution**:
- Check authentication token is valid
- Verify cart has items
- Check MongoDB connection
- Review backend logs for errors

## 🎨 UI Components

### Payment Gateway Modal
Located at: `frontend/src/ui/checkout/OrderSummary.tsx`
- Shows when "PLACE ORDER" is clicked
- Beautiful gradient buttons
- Hover effects
- Cancel option

### Payment Callback Page
Located at: `frontend/src/pages/PaymentCallback.tsx`
- Processes PhonePe callbacks
- Shows payment status (processing/success/failed)
- Animated status indicators
- Auto-redirects on success

## 📝 API Testing with Postman/Thunder Client

### Create Order (Razorpay)
```http
POST http://localhost:5000/api/payments/create-order
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id_here",
      "name": "Test Product",
      "quantity": 1,
      "price": 1000
    }
  ],
  "subtotal": 1000,
  "discount": 0,
  "totalAmount": 1000,
  "shippingAddress": {
    "fullName": "Test User",
    "phoneNumber": "9876543210",
    "addressLine1": "Test Address",
    "city": "Test City",
    "state": "Test State",
    "pincode": "123456",
    "country": "India"
  },
  "gateway": "razorpay",
  "callbackUrl": "http://localhost:5174/payment/callback"
}
```

### Create Order (PhonePe)
Same as above, but change:
```json
"gateway": "phonepe"
```

## 🚨 Important Notes

1. **Production Setup**:
   - Replace test credentials with production keys
   - Update callback URLs to production domain
   - Enable HTTPS for PhonePe (required in production)
   - Test thoroughly before going live

2. **Security**:
   - Never commit `.env` files to git
   - Keep API keys secure
   - Use environment variables for all sensitive data
   - Enable CORS only for trusted domains in production

3. **Error Monitoring**:
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor payment failures
   - Track conversion rates
   - Set up alerts for payment errors

## ✅ Success Criteria

Your implementation is working correctly when:
- ✅ Both payment gateways appear in the modal
- ✅ Razorpay opens its checkout modal
- ✅ PhonePe redirects to payment page
- ✅ Successful payments update order status
- ✅ Cart clears after successful payment
- ✅ Orders appear in "My Orders" page
- ✅ Email notifications are sent
- ✅ Failed payments show error messages
- ✅ No console errors in browser or server

## 🎉 Congratulations!

You now have a fully functional dual payment gateway system! Your users can choose between Razorpay and PhonePe for their payments.

For any issues or questions, refer to:
- `DUAL_PAYMENT_GATEWAY_IMPLEMENTATION.md` for detailed implementation info
- Backend logs for API errors
- Browser console for frontend errors
