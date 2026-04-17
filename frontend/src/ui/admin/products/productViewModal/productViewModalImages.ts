import type { Product } from "../../../../api/types/productTypes";

export function getProductViewModalAllImages(product: Product): string[] {
  return [product.imageUrl || product.image, ...(product.additionalImages || [])].filter(
    Boolean,
  ) as string[];
}
