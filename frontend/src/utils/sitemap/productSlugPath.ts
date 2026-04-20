/** Input shape for building `/product/:slug` paths (keep aligned with product list UIs). */
export type ProductSlugInput = {
  name: string;
  version?: string | null;
};

/** Path for a product detail URL; matches `SitemapPage` and product card navigation. */
export function productPathFromProduct(product: ProductSlugInput): string {
  const namePart = product.name.toLowerCase().replace(/\s+/g, "-");
  const versionPart = product.version
    ? `-${String(product.version).toLowerCase().replace(/\s+/g, "-")}`
    : "";
  return `/product/${namePart}${versionPart}`;
}
