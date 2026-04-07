import type { Product } from "../../api/types/productTypes";
import type { FreeOfferSchedule, ProductDetailPlanOption } from "./purchase/types";

export function tryBuildPricingAfterFreePeriodEnded(
  product: Product,
  isEbook: boolean,
  freeOfferSchedule: FreeOfferSchedule | null,
): ProductDetailPlanOption[] | null {
  const freePeriodEnded =
    freeOfferSchedule?.status === "ended" && product.preFreePricing;
  if (!freePeriodEnded || !product.preFreePricing) return null;

  const pre = product.preFreePricing;
  const options: ProductDetailPlanOption[] = [];

  if (isEbook) {
    const lifetimeFromPre =
      (pre.priceLifetimeINR ?? pre.priceLifetime ?? 0) ||
      (pre.price1INR ?? pre.price1 ?? 0);
    const lifetimeUsdFromPre =
      pre.priceLifetimeUSD ?? pre.price1USD ?? (lifetimeFromPre ? lifetimeFromPre / 83 : 0);
    if (lifetimeFromPre > 0) {
      return [
        {
          id: "lifetime",
          label: "Lifetime Access",
          priceINR: lifetimeFromPre,
          priceUSD: lifetimeUsdFromPre,
          type: "lifetime",
          trialDays: undefined,
          badge: "Best Value",
          savings: null,
        },
      ];
    }
  }

  if (pre.subscriptionDurations && pre.subscriptionDurations.length > 0) {
    pre.subscriptionDurations.forEach((sub, index) => {
      if (
        (sub.price && sub.price > 0) ||
        (sub.priceINR && sub.priceINR > 0) ||
        (sub.priceUSD && sub.priceUSD > 0)
      ) {
        options.push({
          id: `subscription-${index}`,
          label: sub.duration,
          priceINR: sub.priceINR ?? sub.price ?? 0,
          priceUSD: sub.priceUSD ?? (sub.price ? sub.price / 83 : 0),
          type: "subscription",
          trialDays: sub.trialDays,
          badge: sub.duration?.toLowerCase().includes("1")
            ? "Most Popular"
            : sub.duration?.toLowerCase().includes("3")
              ? "Save 30%"
              : null,
          savings: null,
        });
      }
    });
  } else {
    if ((pre.price1INR && pre.price1INR > 0) || (pre.price1 && pre.price1 > 0)) {
      options.push({
        id: "yearly",
        label: "1 Year License",
        priceINR: pre.price1INR ?? pre.price1 ?? 0,
        priceUSD: pre.price1USD ?? (pre.price1 ? pre.price1 / 83 : 0),
        type: "yearly",
        badge: "Most Popular",
        savings: null,
      });
    }
    if ((pre.price3INR && pre.price3INR > 0) || (pre.price3 && pre.price3 > 0)) {
      options.push({
        id: "3year",
        label: "3 Year License",
        priceINR: pre.price3INR ?? pre.price3 ?? 0,
        priceUSD: pre.price3USD ?? (pre.price3 ? pre.price3 / 83 : 0),
        type: "3year",
        badge: "Save 30%",
        savings: null,
      });
    }
  }

  const lifetimePrice = pre.priceLifetimeINR ?? pre.priceLifetime ?? 0;
  if (lifetimePrice > 0) {
    const yearlyPrice =
      options.find((o) => o.type === "yearly" || o.type === "subscription")?.priceINR ?? 0;
    const threeYearTotal = yearlyPrice * 3;
    const lifetimePriceUSD = pre.priceLifetimeUSD ?? lifetimePrice / 83;
    const savings = threeYearTotal > lifetimePrice ? threeYearTotal - lifetimePrice : 0;
    options.push({
      id: "lifetime",
      label: "Lifetime Access",
      priceINR: lifetimePrice,
      priceUSD: lifetimePriceUSD,
      type: "lifetime",
      badge: "Best Value",
      savings: savings > 0 ? `Save ₹${savings.toLocaleString()}` : null,
    });
  }

  const membershipPrice = pre.membershipPriceINR ?? pre.membershipPrice ?? 0;
  if (membershipPrice > 0) {
    options.push({
      id: "membership",
      label: "Membership",
      priceINR: membershipPrice,
      priceUSD: pre.membershipPriceUSD ?? membershipPrice / 83,
      type: "membership",
      badge: "Premium Access",
      savings: null,
    });
  }

  return options.length > 0 ? options : null;
}
