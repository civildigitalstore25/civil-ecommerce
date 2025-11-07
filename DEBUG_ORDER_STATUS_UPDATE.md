# Debug Guide: Order Status Update Issue

## Problem
When changing order status in admin panel, getting "Failed to update order status" error.

## Changes Made for Debugging

### 1. Added Console Logging Throughout the Flow

**Frontend - Orders.tsx**
- `handleStatusChange()`: Logs when update is initiated and user confirmation
- `updateStatusMutation`: Logs API call, success response, and detailed error info

**Frontend - adminOrderApi.ts**
- `updateOrderStatus()`: Logs request URL, body, and response

### 2. How to Debug

1. **Open Browser Console** (F12 → Console tab)

2. **Try to Update Order Status**
   - Change dropdown
   - Click "Update" button
   - Confirm in dialog

3. **Check Console Logs** - You should see:
   ```
   🔄 Attempting to update order: { orderId: "xxx", newStatus: "delivered" }
   ✅ User confirmed, calling mutation...
   📡 Calling API with: { orderId: "xxx", status: "delivered" }
   🌐 AdminOrderAPI - updateOrderStatus called with: { orderId: "xxx", orderStatus: "delivered" }
   🌐 Request URL: /payments/admin/orders/xxx/status
   🌐 Request body: { orderStatus: "delivered" }
   ```

4. **If Error Occurs**, look for:
   ```
   ❌ Update failed: [error details]
   Error response: [full response object]
   Error message: [specific message]
   Error status: [HTTP status code]
   ```

## Common Issues to Check

### Issue 1: Authentication Error (401)
**Symptoms:** Status code 401, "Unauthorized" message
**Solution:** 
- Check if you're logged in as admin
- Check localStorage for token: `localStorage.getItem('token')`
- Verify admin role in token

### Issue 2: Wrong orderId Format
**Symptoms:** Status code 404, "Order not found"
**Solution:**
- Backend expects `orderId` (string like "ORD-xxx")
- NOT MongoDB `_id`
- Check console logs to see what orderId is being sent

### Issue 3: Invalid Status Value
**Symptoms:** Status code 400, "Invalid order status"
**Solution:**
- Backend accepts: `processing`, `delivered`, `cancelled`
- Check console to see what status value is being sent
- Make sure dropdown sends correct value

### Issue 4: CORS or Network Error
**Symptoms:** Network error, CORS error in console
**Solution:**
- Verify backend is running on correct port
- Check VITE_API_BASE_URL in .env file
- Verify CORS settings in backend

## Backend Validation Rules

The backend expects:
```typescript
{
  orderStatus: 'processing' | 'delivered' | 'cancelled'
}
```

And looks up orders by `orderId` field (not `_id`).

## Test the Flow

### Step 1: Check Order Data
Open console and type:
```javascript
// See what orderId looks like
console.log('Orders:', data?.data?.orders[0]);
```

### Step 2: Check Token
```javascript
// Verify token exists
console.log('Token:', localStorage.getItem('token'));
```

### Step 3: Test API Directly
```javascript
// Test API call directly in console
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/payments/admin/orders/ORD-xxx/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ orderStatus: 'delivered' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Expected Console Output (Success)

```
🔄 Attempting to update order: { orderId: "ORD-1001", newStatus: "delivered" }
✅ User confirmed, calling mutation...
📡 Calling API with: { orderId: "ORD-1001", status: "delivered" }
🌐 AdminOrderAPI - updateOrderStatus called with: { orderId: "ORD-1001", orderStatus: "delivered" }
🌐 Request URL: /payments/admin/orders/ORD-1001/status
🌐 Request body: { orderStatus: "delivered" }
🌐 API Response: { success: true, message: "Order status updated successfully", data: {...} }
✅ Update successful: { success: true, ... }
```

## Next Steps

1. **Run the app** and try updating a status
2. **Copy all console logs** from the attempt
3. **Share the logs** to identify the exact issue
4. **Check backend logs** in the terminal for server-side errors

## Files Modified for Debugging

- `frontend/src/ui/admin/Orders.tsx` - Added console logs
- `frontend/src/api/adminOrderApi.ts` - Added console logs

## To Remove Debug Logs Later

Search for these emoji prefixes and remove the console.log lines:
- `🔄` - Attempting update
- `✅` - Success/confirmation
- `❌` - Error/cancellation  
- `📡` - API mutation call
- `🌐` - API request/response

