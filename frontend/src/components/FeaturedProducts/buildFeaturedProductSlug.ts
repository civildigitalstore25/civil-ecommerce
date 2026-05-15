import { productSlugFromProduct } from "../../utils/productSlugFromProduct";

/** URL slug used on the storefront product page. */
export function buildFeaturedProductSlug(product: {
  slug?: string;
  name?: string;
  version?: string;
}): string {
  return productSlugFromProduct(product);
}
