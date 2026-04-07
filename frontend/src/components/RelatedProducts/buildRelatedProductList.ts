import type { Product } from "../../api/types/productTypes";
import {
  RELATED_PRODUCTS_BRAND_CATEGORY_MAP,
  getRelatedProductsBrandKey,
} from "./relatedBrandCategoryMap";

function isActiveProduct(p: Product): boolean {
  return p.status === "active" || !p.status;
}

export function buildRelatedProductList(
  currentProduct: Product,
  apiProducts: Product[] | undefined,
): Product[] {
  if (!apiProducts?.length) return [];

  const activeProducts = apiProducts.filter(isActiveProduct);
  const brandKey = getRelatedProductsBrandKey(currentProduct);

  let related: Product[] = [];

  if (brandKey && RELATED_PRODUCTS_BRAND_CATEGORY_MAP[brandKey]) {
    const map = RELATED_PRODUCTS_BRAND_CATEGORY_MAP[brandKey];
    const currentSubmenuCat = map.find((cat) =>
      currentProduct.category?.toLowerCase().includes(cat),
    );
    if (currentSubmenuCat) {
      related = activeProducts.filter(
        (p) =>
          p._id !== currentProduct._id &&
          p.category?.toLowerCase().includes(currentSubmenuCat),
      );
    } else {
      related = activeProducts.filter(
        (p) =>
          p._id !== currentProduct._id &&
          map.some((cat) => p.category?.toLowerCase().includes(cat)),
      );
    }
  } else {
    related = activeProducts.filter(
      (p) =>
        p._id !== currentProduct._id &&
        p.category === currentProduct.category,
    );
  }

  return related;
}
