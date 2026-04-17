/** URL slug used on the storefront product page. */
export function buildFeaturedProductSlug(product: {
  name?: string;
  version?: string;
}): string {
  const versionPart = product.version?.trim()
    ? `-${product.version.toString().trim().toLowerCase()}`
    : "";
  const base = product.name?.replace(/\s+/g, "-").toLowerCase() ?? "";
  return `${base}${versionPart}`;
}
