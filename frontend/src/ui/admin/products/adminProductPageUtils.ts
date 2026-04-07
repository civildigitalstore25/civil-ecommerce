import type { Product } from "../../../api/types/productTypes";

export function adminProductPageId(p: Product): string | undefined {
  return p._id ?? (p as { id?: string }).id;
}
