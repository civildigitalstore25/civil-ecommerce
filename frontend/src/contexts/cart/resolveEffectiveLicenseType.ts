import type { Product } from "../../types/cartTypes";

export type CartLicenseType = "1year" | "3year" | "lifetime";

function toPositiveNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/**
 * When the UI passes a license bucket that has no price on the product,
 * fall back to another available price tier (server add-to-cart expects a valid type).
 */
export function resolveEffectiveLicenseType(
  product: Product,
  licenseType: CartLicenseType,
  subscriptionPlan?: { planId: string; planLabel: string; planType: string },
): CartLicenseType {
  if (subscriptionPlan) return licenseType;

  const productAny = product as unknown as Record<string, unknown>;
  const has1YearPrice =
    toPositiveNumber(productAny?.price1INR) > 0 ||
    toPositiveNumber(productAny?.price1) > 0;
  const has3YearPrice =
    toPositiveNumber(productAny?.price3INR) > 0 ||
    toPositiveNumber(productAny?.price3) > 0;
  const hasLifetimePrice =
    toPositiveNumber(productAny?.lifetimePriceINR) > 0 ||
    toPositiveNumber(productAny?.priceLifetimeINR) > 0 ||
    toPositiveNumber(productAny?.priceLifetime) > 0;

  if (licenseType === "1year" && !has1YearPrice) {
    if (hasLifetimePrice) return "lifetime";
    if (has3YearPrice) return "3year";
  }

  if (licenseType === "3year" && !has3YearPrice) {
    if (has1YearPrice) return "1year";
    if (hasLifetimePrice) return "lifetime";
  }

  return licenseType;
}
