import type { Product } from "../../../../api/types/productTypes";

export type PricingLine = { label: string; price: number };
export type PricingGroup = { title: string; lines: PricingLine[] };

const isPricingLine = (value: PricingLine | null): value is PricingLine =>
  value !== null;

const pickFirstPositive = (...values: Array<number | undefined | null>) =>
  values.find((v) => typeof v === "number" && Number.isFinite(v) && v > 0) ??
  null;

/** Build pricing summary groups for admin draft product table cells. */
export function buildDraftProductPricingGroups(product: Product): PricingGroup[] {
  const groups: PricingGroup[] = [];

  const subscriptionDurationLines: PricingLine[] =
    product.subscriptionDurations && product.subscriptionDurations.length > 0
      ? product.subscriptionDurations
          .map((sd, idx: number) => {
            const price = pickFirstPositive(sd?.priceINR, sd?.price, 0);
            if (!price) return null;
            return {
              label: sd?.duration || `Option ${idx + 1}`,
              price,
            };
          })
          .filter(isPricingLine)
      : [];

  if (subscriptionDurationLines.length > 0) {
    groups.push({
      title: "Subscription Pricing",
      lines: subscriptionDurationLines,
    });
  } else {
    const legacyLines: PricingLine[] = [];
    if (typeof product.price1 === "number" && product.price1 > 0) {
      legacyLines.push({ label: "Price 1", price: product.price1 });
    }
    if (typeof product.price2 === "number" && product.price2 > 0) {
      legacyLines.push({ label: "Price 2", price: product.price2 });
    }
    if (typeof product.price3 === "number" && product.price3 > 0) {
      legacyLines.push({ label: "Price 3", price: product.price3 });
    }
    if (legacyLines.length > 0) {
      groups.push({ title: "Legacy Pricing", lines: legacyLines });
    }
  }

  const lifetimePrice = pickFirstPositive(
    product.lifetimePriceINR,
    product.priceLifetimeINR,
    product.priceLifetime,
    product.lifetimePrice,
  );
  if (lifetimePrice) {
    groups.push({
      title: "Lifetime Pricing",
      lines: [{ label: "Lifetime", price: lifetimePrice }],
    });
  }

  const membershipPrice = pickFirstPositive(
    product.membershipPriceINR,
    product.membershipPrice,
  );
  if (membershipPrice) {
    groups.push({
      title: "Membership Pricing",
      lines: [{ label: "Membership", price: membershipPrice }],
    });
  }

  const adminSub = (product as Product & { adminSubscription?: unknown[] })
    .adminSubscription as
    | { duration?: string; priceINR?: number; price?: number }[]
    | undefined;
  const adminSubscriptionLines: PricingLine[] =
    adminSub && adminSub.length > 0
      ? adminSub
          .map((ad, idx: number) => {
            const price = pickFirstPositive(ad?.priceINR, ad?.price, 0);
            if (!price) return null;
            return {
              label: ad?.duration || `Admin Option ${idx + 1}`,
              price,
            };
          })
          .filter(isPricingLine)
      : [];

  if (adminSubscriptionLines.length > 0) {
    groups.push({
      title: "Admin Subscription Pricing",
      lines: adminSubscriptionLines,
    });
  }

  return groups;
}
