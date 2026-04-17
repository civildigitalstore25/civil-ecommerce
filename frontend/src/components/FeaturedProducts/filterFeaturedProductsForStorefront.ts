/** Hides admin-only "others" brand from public featured lists. */
export function filterFeaturedProductsForStorefront<
  T extends { brand?: string; company?: string },
>(products: T[]): T[] {
  return products.filter((p) => {
    const b = (p.brand || p.company || "").toString().toLowerCase();
    return b !== "others";
  });
}
