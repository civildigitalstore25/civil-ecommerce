import type { CheckoutCartItem, CheckoutSummary } from "./checkoutTypes";

export function normalizeCheckoutPrice(price: unknown): number {
  return parseFloat(String(price ?? 0).replace(/[^0-9.]/g, "")) || 0;
}

interface LocationStateShape {
  items?: unknown[];
  summary?: Record<string, unknown>;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Normalize `location.state` from cart navigation into cart rows + summary. */
export function parseCheckoutLocationState(state: unknown): {
  rawCartItems: unknown[];
  rawSummary: Record<string, unknown>;
  cartItems: CheckoutCartItem[];
  summary: CheckoutSummary;
} {
  const s = isRecord(state) ? (state as LocationStateShape) : undefined;
  const rawCartItems = Array.isArray(s?.items) ? s.items : [];
  const rawSummary =
    s && isRecord(s.summary)
      ? (s.summary as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  const cartItems: CheckoutCartItem[] = rawCartItems.map((item: unknown) => {
    const row = isRecord(item) ? item : {};
    const product = isRecord(row.product) ? row.product : {};
    return {
      id:
        (row._id as string | number | undefined) ??
        (row.id as string | number | undefined) ??
        (product._id as string | number | undefined) ??
        "",
      product: {
        name: (product.name as string) || "Unknown Product",
        price:
          Number(row.price ?? product.price ?? row.totalPrice ?? 0) || 0,
      },
      quantity: Number(row.quantity) || 1,
    };
  });

  const summary: CheckoutSummary = {
    subtotal: Number(rawSummary.subtotal) || 0,
    discount: Number(rawSummary.discount) || 0,
    total: Number(rawSummary.total) || 0,
    itemCount: Number(rawSummary.itemCount) || cartItems.length,
  };

  return { rawCartItems, rawSummary, cartItems, summary };
}
