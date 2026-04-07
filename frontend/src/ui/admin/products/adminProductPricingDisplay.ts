import type { Product, SubscriptionDuration } from "../../../api/types/productTypes";

export type PricingLine = { label: string; price: number };
export type PricingGroup = { title: string; lines: PricingLine[] };

const isPricingLine = (value: PricingLine | null): value is PricingLine =>
  value !== null;

const pickFirstPositive = (...values: Array<number | undefined | null>) =>
  values.find((v) => typeof v === "number" && Number.isFinite(v) && v > 0) ??
  null;

function mapDurationLines(
  items: SubscriptionDuration[] | undefined,
  labelFallback: (idx: number) => string,
): PricingLine[] {
  if (!items || items.length === 0) return [];
  return items
    .map((sd, idx) => {
      const price = pickFirstPositive(sd?.priceINR, sd?.price, 0);
      if (!price) return null;
      return {
        label: sd?.duration || labelFallback(idx),
        price,
      };
    })
    .filter(isPricingLine);
}

export function buildAdminProductPricingGroups(product: Product): PricingGroup[] {
  const groups: PricingGroup[] = [];

  const subscriptionDurationLines = mapDurationLines(
    product.subscriptionDurations,
    (idx) => `Option ${idx + 1}`,
  );

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

  const adminSubscriptionLines = mapDurationLines(
    product.subscriptions,
    (idx) => `Plan ${idx + 1}`,
  );
  if (adminSubscriptionLines.length > 0) {
    groups.push({
      title: "Subscription Plans",
      lines: adminSubscriptionLines,
    });
  }

  return groups;
}
