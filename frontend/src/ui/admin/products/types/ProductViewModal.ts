import type { Product } from "../../../../api/types/productTypes";
export interface ProductViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}
