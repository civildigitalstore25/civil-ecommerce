import { normalizeSlug } from "./slug/normalizeSlug";
import { productSlugFromNameVersion } from "./slug/productSlugFromNameVersion";

/** Build storefront product URL slug; prefers stored slug, else name + version. */
export function productSlugFromProduct(product: {
  slug?: string;
  name?: string;
  version?: string;
}): string {
  if (product.slug?.trim()) return normalizeSlug(product.slug);
  if (product.name?.trim()) return productSlugFromNameVersion(product.name, product.version);
  return "";
}
