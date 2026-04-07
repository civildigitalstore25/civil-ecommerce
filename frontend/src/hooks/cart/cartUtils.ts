import type { Product } from "../../types/cartTypes";

export function generateCartItemId(): string {
  return `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getPriceByLicenseType(
  product: Product,
  licenseType: "1year" | "3year" | "lifetime",
): number {
  switch (licenseType) {
    case "1year":
      return product.price1 || 0;
    case "3year":
      return product.price3 || 0;
    case "lifetime":
      return product.priceLifetime || 0;
    default:
      return product.price1 || 0;
  }
}
