import type { Product } from "../../api/types/productTypes";

function brandKey(p: Product): string {
  return (p.brand || p.company || "").toString().toLowerCase();
}

function isActive(p: Product): boolean {
  return p.status === "active" || !p.status;
}

/**
 * Order products for home category tabs: active non-others first, then active others,
 * then inactive; cap at 6 for the grid (5 visible on lg + 1 mobile-only).
 */
export function sortProductsForCategoryTabs(products: Product[]): Product[] {
  const primary = products.filter(
    (p) => isActive(p) && brandKey(p) !== "others",
  );
  const secondary = products.filter(
    (p) => isActive(p) && brandKey(p) === "others",
  );
  const tertiary = products.filter(
    (p) => !isActive(p) && brandKey(p) !== "others",
  );
  const fallback = products.filter(
    (p) => !isActive(p) && brandKey(p) === "others",
  );

  return [...primary, ...secondary, ...tertiary, ...fallback].slice(0, 6);
}
