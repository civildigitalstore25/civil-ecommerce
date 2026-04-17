import type { Product } from "../../../../api/types/productTypes";

/** Draft-only list filtered by debounced search (matches Products page draft tab behavior). */
export function filterDraftProductsList(
  rawProducts: Product[],
  searchTerm: string,
  debouncedSearch: string,
): Product[] {
  return rawProducts.filter((product: Product) => {
    if (product.status !== "draft") return false;

    if (searchTerm && debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesBasicFields =
        product.name.toLowerCase().includes(searchLower) ||
        product.version.toLowerCase().includes(searchLower) ||
        product.company.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower)) ||
        (product.shortDescription &&
          product.shortDescription.toLowerCase().includes(searchLower)) ||
        (product.description &&
          product.description.toLowerCase().includes(searchLower));

      const matchesTags =
        product.tags &&
        product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      if (!matchesBasicFields && !matchesTags) return false;
    }

    return true;
  });
}
