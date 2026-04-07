import type { ProductForm } from "../../../../constants/productFormConstants";
import type { BuiltAdminProductPayload } from "./adminProductSavePayloadTypes";

type SubRow = {
  price: number;
  priceINR?: number;
  priceUSD?: number;
};

function asSubs(v: unknown): SubRow[] {
  return Array.isArray(v) ? (v as SubRow[]) : [];
}

/** Returns validation error text, or null if valid. */
export function getAdminProductSaveValidationError(
  productData: BuiltAdminProductPayload,
  newProduct: ProductForm,
  isDraft: boolean,
  brandHasCategories: boolean,
  freeStartTimeNorm: string,
  freeEndTimeNorm: string,
): string | null {
  const name = String(productData.name ?? "");
  if (!isDraft && (!name.trim() || name.startsWith("Draft Product"))) {
    return "Product Name is required";
  }

  const brand = String(productData.brand ?? "");
  if (!isDraft && !brand.trim()) {
    return "Product Brand is required";
  }

  const category = String(productData.category ?? "");
  if (!isDraft && brandHasCategories && !category.trim()) {
    return "Product Category is required";
  }

  const company = String(productData.company ?? "");
  if (!isDraft && !company.trim()) {
    return "Company/Brand is required";
  }

  const image = String(productData.image ?? "");
  if (!isDraft && !image.trim()) {
    return "Main Product Image is required";
  }

  if (!isDraft && !productData.isFreeProduct) {
    const price1 = Number(productData.price1 ?? 0);
    const price1INR = Number(productData.price1INR ?? 0);
    const price1USD = Number(productData.price1USD ?? 0);
    const hasLifetime = !!productData.hasLifetime;
    const lifetimePrice = Number(productData.lifetimePrice ?? 0);
    const subscriptionDurations = asSubs(productData.subscriptionDurations);

    const hasValidPrice =
      (price1 && price1 > 0) ||
      (price1INR && price1INR > 0) ||
      (price1USD && price1USD > 0) ||
      (hasLifetime && lifetimePrice > 0) ||
      subscriptionDurations.some(
        (sub) =>
          sub.price > 0 ||
          (sub.priceINR && sub.priceINR > 0) ||
          (sub.priceUSD && sub.priceUSD > 0),
      );

    if (!hasValidPrice) {
      return "At least one valid price is required (subscription, lifetime, or membership)";
    }
  }

  if (!isDraft && productData.isFreeProduct) {
    if (!newProduct.freeProductStartDate || !newProduct.freeProductEndDate) {
      return "Free product requires Start and End dates for homepage visibility (times optional; default start 00:00, end 23:59).";
    }
    const start = new Date(`${newProduct.freeProductStartDate}T${freeStartTimeNorm}`);
    const end = new Date(`${newProduct.freeProductEndDate}T${freeEndTimeNorm}`);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return "Free product end date/time must be after start date/time";
    }
  }

  return null;
}
