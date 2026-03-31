import type { Product, SubscriptionDuration } from "../api/types/productTypes";
import { currencies } from "../contexts/CurrencyContext";

export type MinProductPrice = {
    priceINR: number;
    priceUSD?: number;
};

const toPositiveNumber = (value: unknown): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const normalizePricePair = (priceINR: unknown, priceUSD: unknown): MinProductPrice | null => {
    const inr = toPositiveNumber(priceINR);
    const usd = toPositiveNumber(priceUSD);

    if (inr > 0) {
        return { priceINR: inr, priceUSD: usd > 0 ? usd : undefined };
    }

    // If INR is missing but USD exists, approximate INR (so INR currency still shows correctly).
    if (usd > 0) {
        return { priceINR: usd * currencies.INR.exchangeRate, priceUSD: usd };
    }

    return null;
};

const pushIfValid = (list: MinProductPrice[], priceINR: unknown, priceUSD: unknown) => {
    const normalized = normalizePricePair(priceINR, priceUSD);
    if (normalized) list.push(normalized);
};

const pushFromDurations = (list: MinProductPrice[], durations?: SubscriptionDuration[]) => {
    if (!durations || durations.length === 0) return;

    for (const d of durations) {
        // Prefer explicit dual-currency fields when present; fallback to legacy `price`.
        pushIfValid(list, d.priceINR ?? d.price, d.priceUSD);
    }
};

export const isDealActive = (product: Product, now: Date = new Date()): boolean => {
    if (!product?.isDeal) return false;

    const startRaw = (product as any).dealStartDate;
    const endRaw = (product as any).dealEndDate;

    const start = startRaw ? new Date(startRaw) : null;
    const end = endRaw ? new Date(endRaw) : null;

    if (start && Number.isFinite(start.getTime()) && now < start) return false;
    if (end && Number.isFinite(end.getTime()) && now > end) return false;

    return true;
};

export const getMinimumProductPrice = (
    product: Product,
    options?: { now?: Date },
): MinProductPrice | null => {
    const now = options?.now ?? new Date();
    const useDeal = isDealActive(product, now);

    const candidates: MinProductPrice[] = [];
    const p: any = product as any;

    if (useDeal) {
        pushFromDurations(candidates, p.dealSubscriptionDurations);
        pushFromDurations(candidates, p.dealSubscriptions);

        pushIfValid(candidates, p.dealMembershipPriceINR ?? p.dealMembershipPrice, p.dealMembershipPriceUSD);

        pushIfValid(candidates, p.dealPrice1INR ?? p.dealPrice1 ?? p.dealPrice1INR, p.dealPrice1USD);
        pushIfValid(candidates, p.dealPrice2INR ?? p.dealPrice2, p.dealPrice2USD);
        pushIfValid(candidates, p.dealPrice3INR ?? p.dealPrice3, p.dealPrice3USD);

        pushIfValid(candidates, p.dealPriceLifetimeINR ?? p.dealPriceLifetime ?? p.dealLifetimePriceINR, p.dealPriceLifetimeUSD);
    }

    // Normal (non-deal) pricing
    pushFromDurations(candidates, p.subscriptionDurations);
    pushFromDurations(candidates, p.subscriptions);

    pushIfValid(candidates, p.membershipPriceINR ?? p.membershipPrice, p.membershipPriceUSD);

    // Support both legacy and dual-currency fields
    pushIfValid(candidates, p.price1INR ?? p.price1, p.price1USD);
    pushIfValid(candidates, p.price2INR ?? p.price2, p.price2USD);
    pushIfValid(candidates, p.price3INR ?? p.price3, p.price3USD);

    pushIfValid(
        candidates,
        p.lifetimePriceINR ?? p.priceLifetimeINR ?? p.priceLifetime ?? p.lifetimePrice,
        p.lifetimePriceUSD ?? p.priceLifetimeUSD,
    );

    if (candidates.length === 0) return null;

    return candidates.reduce((min, curr) => (curr.priceINR < min.priceINR ? curr : min));
};
