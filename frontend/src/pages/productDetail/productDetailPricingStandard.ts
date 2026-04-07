import type { Product } from "../../api/types/productTypes";
import type { ProductDetailPlanOption } from "./purchase/types";

type GetPrice = (
  regularINR: number,
  regularUSD: number,
  dealINR?: number,
  dealUSD?: number,
) => {
  priceINR: number;
  priceUSD: number;
  originalPriceINR?: number;
  originalPriceUSD?: number;
  isDeal: boolean;
};

export function buildStandardProductPricingOptions(
  product: Product,
  getPrice: GetPrice,
): ProductDetailPlanOption[] {
  const options: ProductDetailPlanOption[] = [];

  if (product.subscriptionDurations && product.subscriptionDurations.length > 0) {
    product.subscriptionDurations.forEach((sub, index) => {
      if (
        (sub.price && sub.price > 0) ||
        (sub.priceINR && sub.priceINR > 0) ||
        (sub.priceUSD && sub.priceUSD > 0)
      ) {
        const regularPriceINR = sub.priceINR || sub.price || 0;
        const regularPriceUSD = sub.priceUSD || (sub.price ? sub.price / 83 : 0);
        const dealSub = product.dealSubscriptionDurations?.[index];
        const pricing = getPrice(
          regularPriceINR,
          regularPriceUSD,
          dealSub?.priceINR,
          dealSub?.priceUSD,
        );

        options.push({
          id: `subscription-${index}`,
          label: sub.duration,
          ...pricing,
          type: "subscription",
          trialDays: sub.trialDays,
          badge: sub.duration.toLowerCase().includes("1")
            ? "Most Popular"
            : sub.duration.toLowerCase().includes("3")
              ? "Save 30%"
              : null,
          savings: null,
        });
      }
    });
  } else {
    if ((product.price1 && product.price1 > 0) || (product.price1INR && product.price1INR > 0)) {
      options.push({
        id: "yearly",
        label: "1 Year License",
        priceINR: product.price1INR || product.price1 || 0,
        priceUSD: product.price1USD || (product.price1 ? product.price1 / 83 : 0),
        type: "yearly",
        trialDays: undefined,
        badge: "Most Popular",
        savings: null,
      });
    }

    if ((product.price3 && product.price3 > 0) || (product.price3INR && product.price3INR > 0)) {
      options.push({
        id: "3year",
        label: "3 Year License",
        priceINR: product.price3INR || product.price3 || 0,
        priceUSD: product.price3USD || (product.price3 ? product.price3 / 83 : 0),
        type: "3year",
        trialDays: undefined,
        badge: "Save 30%",
        savings: null,
      });
    }
  }

  const lifetimePrice =
    product.lifetimePriceINR || product.priceLifetime || product.lifetimePrice || 0;
  if (lifetimePrice > 0) {
    const yearlyPrice =
      options.find((opt) => opt.type === "yearly" || opt.type === "subscription")?.priceINR || 0;
    const threeYearTotal = yearlyPrice * 3;
    const lifetimePriceUSD = product.lifetimePriceUSD || lifetimePrice / 83;
    const ext = product as Product & {
      dealPriceLifetimeINR?: number;
      dealPriceLifetimeUSD?: number;
    };
    const pricing = getPrice(
      lifetimePrice,
      lifetimePriceUSD,
      ext.dealPriceLifetimeINR,
      ext.dealPriceLifetimeUSD,
    );
    const savings =
      threeYearTotal > pricing.priceINR ? threeYearTotal - pricing.priceINR : 0;

    options.push({
      id: "lifetime",
      label: "Lifetime Access",
      ...pricing,
      type: "lifetime",
      trialDays: undefined,
      badge: "Best Value",
      savings: savings > 0 ? `Save ₹${savings.toLocaleString()}` : null,
    });
  }

  const membershipPrice = product.membershipPriceINR || product.membershipPrice || 0;
  if (membershipPrice > 0) {
    const membershipPriceUSD = product.membershipPriceUSD || membershipPrice / 83;
    const ext = product as Product & {
      dealMembershipPriceINR?: number;
      dealMembershipPriceUSD?: number;
    };
    const pricing = getPrice(
      membershipPrice,
      membershipPriceUSD,
      ext.dealMembershipPriceINR,
      ext.dealMembershipPriceUSD,
    );

    options.push({
      id: "membership",
      label: "Membership",
      ...pricing,
      type: "membership",
      trialDays: undefined,
      badge: "Premium Access",
      savings: null,
    });
  }

  return options;
}
