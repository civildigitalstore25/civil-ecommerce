import { brandLabels, categoryLabels } from "./brandCategoryListingConstants";

export function getListingDisplayTitle(
  brand: string,
  category: string,
  searchTerm: string,
): string {
  if (searchTerm) {
    return `Search Results for "${searchTerm}"`;
  }
  if (category && brand) {
    const categoryName = categoryLabels[category] || category;
    const brandName = brandLabels[brand] || brand;
    return `${categoryName} - ${brandName}`;
  }
  if (brand) {
    return brandLabels[brand] || brand;
  }
  if (category) {
    return categoryLabels[category] || category;
  }
  return "All Products";
}
