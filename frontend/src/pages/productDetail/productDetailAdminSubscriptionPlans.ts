import type { Product } from "../../api/types/productTypes";
import type { ProductDetailPlanOption } from "./purchase/types";

export function getProductDetailAdminSubscriptionPlans(
  product: Product | null | undefined,
): ProductDetailPlanOption[] {
  if (!product?.subscriptions) return [];

  return product.subscriptions
    .filter(
      (sub) =>
        (sub.price && sub.price > 0) ||
        (sub.priceINR && sub.priceINR > 0) ||
        (sub.priceUSD && sub.priceUSD > 0),
    )
    .map((sub, index) => ({
      id: `admin-subscription-${index}`,
      label: sub.duration,
      priceINR: sub.priceINR || sub.price || 0,
      priceUSD: sub.priceUSD || (sub.price ? sub.price / 83 : 0),
      type: "admin-subscription" as const,
      trialDays: undefined,
      badge: sub.duration.toLowerCase().includes("monthly")
        ? "Flexible"
        : sub.duration.toLowerCase().includes("annual")
          ? "Best Deal"
          : null,
      savings: null,
    }));
}
