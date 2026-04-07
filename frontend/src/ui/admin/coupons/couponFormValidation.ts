import type { CouponFormPayload } from "./types";

/** Returns an error message for `alert()`, or null if valid */
export function validateCouponFormPayload(form: CouponFormPayload): string | null {
  if (!form.code.trim()) return "Coupon code is required";
  if (!form.name.trim()) return "Coupon name is required";
  if (form.discountValue <= 0) return "Discount value must be greater than 0";
  if (form.discountType === "Percentage" && form.discountValue > 100) {
    return "Percentage discount cannot exceed 100";
  }
  if (!form.validFrom) return "Valid From date is required";
  if (!form.validTo) return "Valid To date is required";
  if (new Date(form.validFrom) > new Date(form.validTo)) {
    return "Valid From date must be before Valid To date";
  }
  if (form.usageLimit < 1) return "Usage limit must be at least 1";
  return null;
}
