# Free Products Feature – Implementation Guide

## Overview

This feature allows **admins to create free products (₹0)** that are shown on the **homepage only for a specific time window**. Users can order these products without going through the payment gateway because the order total is zero.

### Summary of behaviour

| Aspect | Detail |
|--------|--------|
| **Who** | Admin creates/edits products with price ₹0 and a visibility window |
| **Where** | Products appear in a dedicated section on the homepage (only when current time is within the window) |
| **Order flow** | User adds to cart → checkout → order is created as **paid** immediately (no Cashfree); confirmation emails sent |
| **Existing support** | Backend already supports **free orders** when `totalAmount <= 0` (see `paymentController.createOrder`) |

### Admin panel visibility

**Yes – free products and their orders are fully visible in the admin panel.**

| Admin area | Visibility |
|------------|------------|
| **Product Management** | Free products are stored in the same **Product** collection as all other products. They appear in the admin product list (same API: list/filter products). You can create, edit, view, and delete them like any other product. Optionally show a "Free product" badge or add a filter for `isFreeProduct === true`. |
| **Order Management** | When a customer orders a free product (₹0 total), the order is saved in the same **Order** collection with `paymentStatus: 'paid'` and `orderStatus: 'processing'`. It appears in the admin **Order Management** list (same admin orders API). Admin can view order details, update status (e.g. to delivered), and handle it like any other order. No extra implementation is needed for orders to show up. |

No separate "free product store" or "free order store" is required; existing Product and Order collections and admin UIs are used.

---

## 1. Backend

### 1.1 Product model – new fields

Add to **`backend/models/Product.ts`** (interface and schema):

```ts
// In IProduct interface add:
isFreeProduct?: boolean;
freeProductStartDate?: Date;  // When the product starts showing on homepage
freeProductEndDate?: Date;    // When it stops showing on homepage

// In productSchema add:
isFreeProduct: { type: Boolean, default: false },
freeProductStartDate: { type: Date },
freeProductEndDate: { type: Date },
```

**Rules (enforced in API/admin UI):**

- If `isFreeProduct` is true, require `freeProductStartDate` and `freeProductEndDate`.
- Product must be effectively **₹0** (e.g. `price1INR` / `price1` and any subscription/lifetime/membership prices used for the default plan set to 0).

### 1.2 API – get active free products

Create **`backend/controllers/freeProductsController.ts`**:

```ts
import { Request, Response } from 'express';
import Product from '../models/Product';

export const getActiveFreeProducts = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const products = await Product.find({
      isFreeProduct: true,
      freeProductStartDate: { $lte: now },
      freeProductEndDate: { $gte: now },
      status: 'active',
      isOutOfStock: { $ne: true },
      $or: [
        { price1INR: 0 },
        { price1: 0 },
        { price1INR: { $exists: false }, price1: 0 }
      ]
    }).sort({ freeProductEndDate: 1 }).lean();

    res.json({ success: true, products, count: products.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

Add route (e.g. **`backend/routes/freeProductsRoutes.ts`**):

```ts
import { Router } from 'express';
import { getActiveFreeProducts } from '../controllers/freeProductsController';
const router = Router();
router.get('/active', getActiveFreeProducts);
export default router;
```

Register in **`backend/server.ts`**:

```ts
import freeProductsRoutes from './routes/freeProductsRoutes';
// ...
app.use('/api/free-products', freeProductsRoutes);
```

### 1.3 Free order flow (already implemented)

In **`backend/controllers/paymentController.ts`**, `createOrder` already does:

- If `totalAmount <= 0` → **no Cashfree**; order is created with `paymentStatus: 'paid'`, `orderStatus: 'processing'`.
- Confirmation emails (admin + customer) are sent.

So no payment gateway change is needed for free products; only ensure cart total is 0 when the user checks out with only free product(s).

### 1.4 Admin create/update product

- Allow **price 0** when `isFreeProduct` is true (skip “price required” validation in that case).
- When saving a product with `isFreeProduct: true`, validate:
  - `freeProductStartDate` and `freeProductEndDate` are present and `freeProductEndDate > freeProductStartDate`.
- Store `isFreeProduct`, `freeProductStartDate`, `freeProductEndDate` in the product document.

---

## 2. Frontend – Admin

### 2.1 Add/Edit product form

In **`frontend/src/ui/admin/products/AddProductModal.tsx`** (or equivalent):

1. **Checkbox / toggle:** “Free product (show on homepage for limited time)”.
2. When checked:
   - Show **Free product start date/time** and **Free product end date/time** (reuse same kind of date/time inputs as for deals).
   - Ensure the default “plan” (e.g. first subscription or one-time) is set to **₹0** (prefill or validate).
3. **Validation:**
   - If “Free product” is checked: start and end dates required; end > start; at least one price (e.g. `price1INR` or first subscription) must be 0.
4. **Submit payload:** Include `isFreeProduct`, `freeProductStartDate`, `freeProductEndDate` in the product object sent to the backend.

### 2.2 Product list / table (optional)

- Show a badge or column “Free product” when `product.isFreeProduct` is true.
- Optionally filter “Free products” in the admin products list.

---

## 3. Frontend – Homepage

### 3.1 API client

Create **`frontend/src/api/freeProductsApi.ts`**:

```ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getActiveFreeProducts = async () => {
  const { data } = await axios.get(`${API_URL}/api/free-products/active`);
  return data;
};

export const useActiveFreeProducts = () => {
  return useQuery({
    queryKey: ['activeFreeProducts'],
    queryFn: getActiveFreeProducts,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
```

(Use `useQuery` from `@tanstack/react-query` if that’s your project standard.)

### 3.2 Homepage section component

Create **`frontend/src/ui/home/FreeProductsSection.tsx`** (or similar):

- Call `getActiveFreeProducts()` (or `useActiveFreeProducts()`).
- If `products.length === 0`, render nothing (or a “No free products right now” message).
- Otherwise render a section **“Free for limited time”** (or similar):
  - List/card grid of products (image, name, version, “Free” badge, **countdown** to `freeProductEndDate`).
  - Reuse or mirror the **Deals** section (e.g. `Deals.tsx` + `CountdownTimer`) for layout and countdown.
- Each card:
  - **CTA:** “Get it free” or “Add to cart” → add to cart; user goes to checkout; order total ₹0 → existing free order flow (no payment gateway).

### 3.3 Add section to homepage

In **`frontend/src/pages/HomePage.tsx`**:

- Import `FreeProductsSection`.
- Render it where you want (e.g. after hero/banner, before or after “Best Selling” / “Deals”).
- Section is visible only when the API returns at least one product (current time within each product’s start/end window).

### 3.4 Product detail page (optional)

- If the product is an active free product, show a banner: “Free for a limited time – order before [end date]” and emphasise that no payment is required at checkout.

---

## 4. User flow (no payment gateway)

1. User sees “Free for limited time” on homepage with one or more products.
2. User clicks a product → product detail page (optional: show “Free – no payment required”).
3. User adds the free product to cart.
4. User goes to checkout; cart total = ₹0.
5. User fills shipping/contact details and places order.
6. Backend `createOrder` sees `totalAmount <= 0` → creates order with `paymentStatus: 'paid'`, skips Cashfree, sends confirmation emails.
7. User gets order confirmation and, if applicable, download link (e.g. from `driveLink`).

No payment gateway is involved.

---

## 5. Checklist

| # | Task | Location |
|---|------|----------|
| 1 | Add `isFreeProduct`, `freeProductStartDate`, `freeProductEndDate` to Product model | `backend/models/Product.ts` |
| 2 | Add `getActiveFreeProducts` controller | `backend/controllers/freeProductsController.ts` |
| 3 | Add route `GET /api/free-products/active` | `backend/routes/freeProductsRoutes.ts` + `server.ts` |
| 4 | Admin: “Free product” toggle + start/end date/time in product form; allow price 0 when free | `frontend/.../AddProductModal.tsx` (or product form) |
| 5 | Admin: validate free product dates and price 0 on save | Same form + backend if needed |
| 6 | Frontend: `getActiveFreeProducts` API + `useActiveFreeProducts` hook | `frontend/src/api/freeProductsApi.ts` |
| 7 | Homepage section “Free for limited time” with countdown and “Get it free” CTA | `frontend/src/ui/home/FreeProductsSection.tsx` |
| 8 | Render free products section on homepage | `frontend/src/pages/HomePage.tsx` |
| 9 | (Optional) Product detail banner for active free product | `frontend/src/pages/ProductDetail.tsx` |
| 10 | *(No extra work)* Free products appear in **Product Management**; orders for them appear in **Order Management** (same collections and admin APIs) | — |

---

## 6. Notes

- **Product Management:** Free products are normal products; they appear in the admin product list and can be managed like any other product. **Order Management:** Orders for free products (₹0) are stored in the same Order collection and show in the admin order list; admins can view and update status like any other order.
- **Time window:** Only products with `freeProductStartDate <= now <= freeProductEndDate` are returned by `GET /api/free-products/active` and shown on the homepage.
- **Price:** Backend can optionally double-check that products returned as “active free” have price 0 (e.g. in `getActiveFreeProducts` or in a shared helper).
- **Stock:** Consider excluding `isOutOfStock` products from the active free products list (as in the example query).
- **Deals vs free products:** Deals are discounted paid products; free products are ₹0 and time-bound on the homepage. Use separate fields (`isFreeProduct` + dates) to keep the two features clear and independent.

This document is the single source of truth for implementing the “admin creates free products, shown on homepage for a limited time, user orders without payment gateway” feature.
