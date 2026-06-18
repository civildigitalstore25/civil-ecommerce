import type { CartItem, CartSummary, Product } from "../../types/cartTypes";
import type { CartLicenseType } from "./resolveEffectiveLicenseType";

const STORAGE_KEY = "guest_cart_v1";

type GuestCartRow = CartItem & { _id?: string };

function readRows(): GuestCartRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRows(rows: GuestCartRow[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function toPositiveNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function resolveGuestItemPrice(
  product: Product,
  licenseType: CartLicenseType,
  subscriptionPlan?: { planId: string; planLabel: string; planType: string },
): number {
  if (subscriptionPlan?.planId === "free") return 0;

  const productAny = product as unknown as Record<string, unknown>;

  if (subscriptionPlan?.planId === "lifetime") {
    return (
      toPositiveNumber(productAny.lifetimePriceINR) ||
      toPositiveNumber(productAny.priceLifetimeINR) ||
      toPositiveNumber(productAny.priceLifetime)
    );
  }

  if (licenseType === "lifetime") {
    return (
      toPositiveNumber(productAny.lifetimePriceINR) ||
      toPositiveNumber(productAny.priceLifetimeINR) ||
      toPositiveNumber(productAny.priceLifetime)
    );
  }

  if (licenseType === "3year") {
    return (
      toPositiveNumber(productAny.price3INR) || toPositiveNumber(productAny.price3)
    );
  }

  return (
    toPositiveNumber(productAny.price1INR) || toPositiveNumber(productAny.price1)
  );
}

export function computeGuestCartSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return {
    subtotal,
    discount: 0,
    total: subtotal,
    itemCount,
  };
}

export function loadGuestCart(): { items: CartItem[]; summary: CartSummary } {
  const items = readRows();
  return { items, summary: computeGuestCartSummary(items) };
}

export function clearGuestCartStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function addGuestCartItem(
  product: Product,
  licenseType: CartLicenseType,
  quantity = 1,
  subscriptionPlan?: { planId: string; planLabel: string; planType: string },
): CartItem[] {
  const rows = readRows();
  const price = resolveGuestItemPrice(product, licenseType, subscriptionPlan);
  const productId = product._id ?? "";

  const existingIndex = rows.findIndex(
    (row) =>
      row.product._id === productId && row.licenseType === licenseType,
  );

  if (existingIndex >= 0) {
    const existing = rows[existingIndex];
    existing.quantity += quantity;
    existing.totalPrice = existing.price * existing.quantity;
    if (subscriptionPlan) existing.subscriptionPlan = subscriptionPlan;
  } else {
    const lineId = `guest-${productId}-${licenseType}-${Date.now()}`;
    rows.push({
      id: lineId,
      _id: lineId,
      product,
      licenseType,
      quantity,
      price,
      totalPrice: price * quantity,
      ...(subscriptionPlan ? { subscriptionPlan } : {}),
    });
  }

  writeRows(rows);
  return rows;
}

export function removeGuestCartItem(itemId: string): CartItem[] {
  const rows = readRows().filter((row) => row.id !== itemId && row._id !== itemId);
  writeRows(rows);
  return rows;
}

export function updateGuestCartItemQuantity(
  itemId: string,
  quantity: number,
): CartItem[] {
  const rows = readRows().map((row) => {
    if (row.id !== itemId && row._id !== itemId) return row;
    return {
      ...row,
      quantity,
      totalPrice: row.price * quantity,
    };
  });
  writeRows(rows);
  return rows;
}

export function clearGuestCartItems(): void {
  clearGuestCartStorage();
}

export function guestCartItemsForMerge(items: CartItem[]) {
  return items.map((item) => ({
    productId: item.product._id ?? "",
    licenseType: item.licenseType,
    quantity: item.quantity,
    subscriptionPlan: item.subscriptionPlan,
  }));
}
