/** Build storefront product URL slug from name + optional version */
export function productSlugFromProduct(product: {
  name?: string;
  version?: string;
}): string {
  const versionPart = product.version?.trim()
    ? `-${product.version.toString().trim().toLowerCase()}`
    : "";
  return `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
}
