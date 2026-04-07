import type { Product } from "../../../api/types/productTypes.ts";

export function filterAdminProductsPageList(
  product: Product,
  opts: {
    selectedStatus: string;
    showBestSellers: boolean;
    searchTerm: string;
    debouncedSearch: string;
  },
): boolean {
  if (product.status === "draft") return false;

  if (opts.selectedStatus !== "All Status") {
    const productStatus = product.status || "active";
    if (productStatus !== opts.selectedStatus) return false;
  }

  if (opts.showBestSellers && !product.isBestSeller) return false;

  if (opts.searchTerm && opts.debouncedSearch) {
    const searchLower = opts.debouncedSearch.toLowerCase();
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
}
