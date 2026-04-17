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

export function buildEbookPricingOptions(
  product: Product,
  getPrice: GetPrice,
): ProductDetailPlanOption[] {
  const p = product as Product & {
    dealPriceLifetimeINR?: number;
    dealPriceLifetimeUSD?: number;
  };
  const lifetimeINR =
    p.lifetimePriceINR ||
    p.priceLifetimeINR ||
    p.priceLifetime ||
    p.lifetimePrice ||
    p.price1INR ||
    p.price1 ||
    0;
  const lifetimeUSD =
    p.lifetimePriceUSD ||
    p.priceLifetimeUSD ||
    p.price1USD ||
    (lifetimeINR ? lifetimeINR / 83 : 0);
  if (lifetimeINR <= 0) return [];

  const pricing = getPrice(
    lifetimeINR,
    lifetimeUSD,
    p.dealPriceLifetimeINR,
    p.dealPriceLifetimeUSD,
  );
  return [
    {
      id: "lifetime",
      label: "Lifetime Access",
      ...pricing,
      type: "lifetime",
      trialDays: undefined,
      badge: "Best Value",
      savings: null,
    },
  ];
}
