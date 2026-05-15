import { productSlugFromProduct } from "../productSlugFromProduct";

/** Input shape for building `/product/:slug` paths (keep aligned with product list UIs). */
export type ProductSlugInput = {
  slug?: string | null;
  name: string;
  version?: string | null;
};

/** Path for a product detail URL; matches `SitemapPage` and product card navigation. */
export function productPathFromProduct(product: ProductSlugInput): string {
  const slug = productSlugFromProduct({
    slug: product.slug ?? undefined,
    name: product.name,
    version: product.version ?? undefined,
  });
  return `/product/${slug}`;
}
