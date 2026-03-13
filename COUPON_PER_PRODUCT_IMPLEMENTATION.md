# Coupon Per Product – Implementation Plan

## 1. Current Coupon System (Summary)

| Use case | How it works |
|----------|----------------|
| **Popup (landing)** | User fills form → `createWelcomeLead` creates a **Lead** + a **Coupon** (e.g. `WELCOMExxxx`, 10%, 30 days, 1 use). Coupon is **site-wide**. |
| **Admin dashboard** | Admin uses “Add coupon” → creates a **Coupon** with code, discount, dates, usage limit. Coupon is **site-wide**. |

- **Model**: `Coupon` has `code`, `name`, `description`, `discountType`, `discountValue`, `validFrom`, `validTo`, `usageLimit`, `usedCount`, `status`. No product link.
- **Validation**: Checkout calls `POST /api/coupons/validate` with `{ code, subtotal }`. Discount is applied to **entire cart subtotal**.
- **Visibility**: Coupons are applied only at checkout (user enters code). There is no “coupon visible only on product X” today.

---

## 2. Goal: “Coupon per product”

- Admin can create a coupon **tied to one or more products**.
- That coupon is **valid only when the cart contains at least one of those products** (validated at checkout when the customer enters the code).
- **Not shown on the user-facing site**: The coupon is **private**. Admin creates it and **sends the coupon code (and the product it applies to) manually** to the specific customer (e.g. by email, WhatsApp). Customers do **not** see it on product pages or anywhere on the storefront—they use it at checkout only if they received it from admin.

**Confirmation — visibility:**  
Product-specific coupons are **not shown to users** on the storefront. They are created by admin and shared manually with that particular customer (code + which product the coupon is applicable to). The customer only sees/uses the coupon at checkout when they enter the code; there is no listing or display of these coupons on product pages or elsewhere.

---

## 3. Recommended Solution

### 3.1 Design choices

| Decision | Recommendation | Reason |
|----------|----------------|--------|
| **Data model** | Add optional `applicableProductIds: ObjectId[]` to `Coupon`. | Empty/undefined = site-wide (keeps existing popup + admin coupons unchanged). Non-empty = product-specific. |
| **Discount scope** | Product-specific coupon: apply discount **only to the total of matching cart items**. | True “per product” behaviour; site-wide coupons still apply to full subtotal. |
| **Visibility** | **Do not expose** product-specific coupons on the storefront. Admin shares the code and applicable product(s) manually with the customer. | Coupon is “for that product” in terms of **applicability only**—it is not displayed on product pages or anywhere public. |
| **Backward compatibility** | No migration of existing data: `applicableProductIds` optional, default `[]` or not set = site-wide. | No change to existing coupons or flows. |

### 3.2 Behaviour matrix

| Coupon type | `applicableProductIds` | Valid when | Discount applied to |
|-------------|------------------------|------------|----------------------|
| Site-wide (existing) | empty / not set | Always (subject to dates/limit) | Full cart subtotal |
| Product-specific (new) | one or more product IDs | Cart contains at least one of those products | Only the sum of line totals for those products |

### 3.3 Admin workflow: creating a product-specific coupon

Step-by-step flow for how admin creates and uses a product-specific coupon:

1. **Open Admin Dashboard**  
   Admin logs in and goes to the **Coupons** section (e.g. Admin → Coupons).

2. **Create new coupon**  
   Admin clicks **“Add coupon”** / **“Create coupon”**. The existing coupon form opens (code, name, discount type, value, dates, usage limit, status).

3. **Choose coupon type**  
   - **Site-wide coupon (unchanged):** Leave **“Applicable products”** empty. Coupon works on entire cart as today.  
   - **Product-specific coupon:** In the form, use the new **“Applicable products”** field (multi-select or searchable dropdown). Select **one or more products** this coupon is valid for.

4. **Fill other fields**  
   Admin enters:
   - **Code** (e.g. `CUST20` or generate)
   - **Name** (e.g. “20% off for Customer X”)
   - **Discount type** (Percentage / Fixed) and **value**
   - **Valid from** / **Valid to**
   - **Usage limit** (e.g. 1 for single-use)
   - **Status** (Active)

5. **Save**  
   Admin clicks **Save**. Backend stores the coupon with `applicableProductIds` set to the selected product(s). The coupon appears in the admin coupon list with a **“Product-specific”** badge and the product name(s).

6. **Share with the customer (manual, outside the app)**  
   Admin sends the coupon to the intended customer by email, WhatsApp, etc., including:
   - The **coupon code**
   - The **product name or link** the coupon applies to (so the customer knows to add that product and use the code at checkout).

7. **Customer usage**  
   Customer adds the **applicable product** to cart, goes to checkout, enters the **code**, and applies it. Backend validates that the cart contains one of the linked products and applies the discount only to those line(s).

**Summary:** Admin creates coupon in dashboard → optionally selects product(s) → saves → shares code + product info manually with the customer → customer uses code at checkout when that product is in the cart.

---

## 4. Backend Changes

### 4.1 Model: `backend/models/Coupon.ts`

- Add optional field:
  - `applicableProductIds: Types.ObjectId[]` (ref `'Product'`), default `[]`.
- Interface:
  - `applicableProductIds?: Types.ObjectId[];`
- Ensure existing coupons without this field are treated as site-wide (empty array or undefined).

### 4.2 Validation logic: `validateCoupon`

- **Request body** (extend current):
  - `code`, `subtotal` (required, as now).
  - `productIds?: string[]` (optional): list of product IDs in the cart (from frontend).
- **Logic**:
  1. Load coupon by code (case-insensitive), check active, dates, usage limit (unchanged).
  2. If coupon has `applicableProductIds` and length &gt; 0:
     - If `productIds` missing or empty → return 400: “This coupon is valid only for specific products. Add the applicable product(s) to your cart.”
     - Else check intersection: at least one `productIds` must be in `applicableProductIds`.
     - If no overlap → return 400: “This coupon is not valid for the products in your cart.”
     - **Eligible subtotal**: backend must receive **line totals per product** to compute discount only on matching items. So extend request body to:
       - `items: { productId: string; subtotal: number }[]` (or keep `subtotal` and add `items`).
     - **Eligible amount** = sum of `item.subtotal` for items whose `productId` is in `applicableProductIds`.
     - Compute discount on **eligible amount** (Percentage or Fixed), cap at eligible amount.
     - Response: include `discountAmount`, `eligibleSubtotal`, and optionally `applicableToProductIds` so frontend can show “Applied to product X”.
  3. If coupon has no product restriction (`applicableProductIds` empty/undefined):
     - Keep current behaviour: discount on full `subtotal`, same response shape (optional: still accept `items` for future use).

So the validate API contract becomes:

- In: `code`, `subtotal`, optional `productIds`, optional `items: { productId, subtotal }[]`.
- If product-specific coupon: require `items` (or at least `productIds` + per-product subtotals). If only `subtotal` is sent and coupon is product-specific, return clear error.
- Out: `success`, `coupon: { code, name, discountType, discountValue, discountAmount, remainingUses, eligibleSubtotal?, applicableToProductIds? }`.

### 4.3 Apply coupon: `applyCoupon`

- No change to logic: still increment `usedCount` and deactivate when limit reached. Product restriction is enforced at validate; apply stays the same.

### 4.4 Create/Update coupon

- **Create**: Accept `applicableProductIds?: string[]` in body; convert to ObjectIds and store.
- **Update**: Same; allow clearing to make a product coupon site-wide (empty array) or setting product IDs.

### 4.5 No public “coupons for product” endpoint

- Product-specific coupons are **not** listed on the storefront. There is **no need** for a public `GET /api/coupons?productId=...` that returns coupon codes to end users.
- Admin already sees all coupons (including product-specific ones and their `applicableProductIds`) in the admin coupon list. No extra endpoint is required for the “admin sends code manually to customer” flow.

---

## 5. Frontend Changes

### 5.1 Checkout

- **Cart → product IDs and line totals**  
  When calling validate, send:
  - `productIds`: list of product IDs in the current cart (from `rawCartItems`, e.g. `item.product?._id` or `item._id` per your cart shape).
  - `items`: `{ productId, subtotal }[]` for each cart line (so backend can compute eligible subtotal for product-specific coupons).
- **Validate request**  
  - Always send `code` and `subtotal`.  
  - Send `productIds` and `items` (from cart) so backend can apply product-specific rules and eligible subtotal.
- **UI**  
  - If response includes `eligibleSubtotal` / product-specific message, you can show “Discount applied to selected products” or similar.

### 5.2 Admin: Add/Edit coupon

- **Product selector**  
  - In the coupon form, add an optional multi-select (or searchable dropdown) for **Products**.  
  - Data: fetch from existing products API (e.g. list of products with `_id` and `name`).  
  - Stored as `applicableProductIds` (array of IDs).  
  - If none selected: coupon remains **site-wide** (same as today).
- **List view**  
  - For each coupon, if `applicableProductIds?.length > 0`, show a badge like “Product-specific” and optionally list product names (from product IDs).  
  - Helps admin see which coupons are per-product.

### 5.3 Product detail page / storefront

- **No changes.** Product-specific coupons are **not** shown on the product page or anywhere on the user-facing site. The customer only has the code because admin sent it to them (e.g. email/WhatsApp) along with the product name or link.

### 5.4 Checkout only

- The only place the customer uses the coupon is **checkout**: they enter the code there. Validation (and “this coupon is valid only for product X”) happens when they apply it; no need to show or hint coupon codes on cart/product pages.

---

## 6. Implementation Checklist

- [ ] **Backend**
  - [ ] Extend `Coupon` model with `applicableProductIds` (optional array of ObjectIds, ref Product).
  - [ ] Extend `validateCoupon`: accept `productIds` and `items`; implement product-specific validation and eligible-subtotal discount; return `eligibleSubtotal` / `applicableToProductIds` when applicable.
  - [ ] Extend `createCoupon` / `updateCoupon`: accept and persist `applicableProductIds`.
- [ ] **Frontend – Checkout**
  - [ ] Build `productIds` and `items` from cart; send with `POST /api/coupons/validate`.
  - [ ] Handle new response fields and optional “product-specific” messaging in UI.
- [ ] **Frontend – Admin**
  - [ ] Add product multi-select to coupon form; save `applicableProductIds`.
  - [ ] In coupon list, show “Product-specific” and product names when `applicableProductIds` is non-empty (so admin knows which product(s) to tell the customer).
- [ ] **Frontend – Product detail / storefront**
  - [ ] No work: product-specific coupons are not displayed to users; admin shares the code manually.

---

## 7. Edge Cases & Notes

- **Mixed cart**: Cart has both product-A and product-B. Coupon is for product-A only. Discount applies only to A’s line total; B stays full price.
- **Multiple product-specific coupons**: One coupon per product (or one coupon for multiple products). User can only apply one coupon per order if that’s your rule; validation should reflect that.
- **Popup / welcome coupons**: Leave `applicableProductIds` unset or `[]` so they remain site-wide; no change to lead or email flow.
- **Existing admin coupons**: No migration; existing documents work as site-wide. New field default (e.g. `[]`) keeps behaviour consistent.

---

## 8. File Reference (for implementation)

| Area | File(s) |
|------|--------|
| Coupon model | `backend/models/Coupon.ts` |
| Validate/apply/create/update | `backend/controllers/couponController.ts` |
| Coupon routes | `backend/routes/couponRoutes.ts` |
| Checkout validate call | `frontend/src/pages/CheckoutPage.tsx` |
| Admin coupon list + form | `frontend/src/ui/admin/coupons/Coupons.tsx` |
| Products API (for admin dropdown) | Use existing product list API used elsewhere in admin |

This plan keeps existing coupon flows intact and adds a clear, backward-compatible “coupon per product” feature. Product-specific coupons are **not shown on the user side**; they are created by admin and shared manually with the specific customer (code + applicable product).
