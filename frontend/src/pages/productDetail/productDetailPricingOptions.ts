import type { Product } from "../../api/types/productTypes";
import type { FreeOfferSchedule, ProductDetailPlanOption } from "./purchase/types";
import { createProductDetailGetPrice } from "./productDetailPricingGetPrice";
import { tryBuildPricingAfterFreePeriodEnded } from "./productDetailPricingPreFreeEnded";
import { buildEbookPricingOptions } from "./productDetailPricingEbook";
import { buildStandardProductPricingOptions } from "./productDetailPricingStandard";

export { getProductDetailAdminSubscriptionPlans } from "./productDetailAdminSubscriptionPlans";

type PricingParams = {
  isActiveDeal: boolean;
  isActiveFreeProduct: boolean;
  freeOfferSchedule: FreeOfferSchedule | null;
};

export function getProductDetailPricingOptions(
  product: Product | null | undefined,
  { isActiveDeal, isActiveFreeProduct, freeOfferSchedule }: PricingParams,
): ProductDetailPlanOption[] {
  if (!product) return [];

  const productBrand = String(product.brand || product.company || "").toLowerCase();
  const isEbook = productBrand === "ebook";
  const getPrice = createProductDetailGetPrice(isActiveDeal);

  if (isActiveFreeProduct) {
    return [
      {
        id: "free",
        label: "Free",
        priceINR: 0,
        priceUSD: 0,
        type: "yearly",
        trialDays: undefined,
        badge: "Free",
        savings: null,
      },
    ];
  }

  const preFreeOptions = tryBuildPricingAfterFreePeriodEnded(
    product,
    isEbook,
    freeOfferSchedule,
  );
  if (preFreeOptions) return preFreeOptions;

  if (isEbook) {
    return buildEbookPricingOptions(product, getPrice);
  }

  return buildStandardProductPricingOptions(product, getPrice);
}
