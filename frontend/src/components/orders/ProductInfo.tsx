
import React from "react";
import type { IOrder } from "../../api/types/orderTypes";

interface ProductInfoProps {
  order: IOrder;
  onBuyAgain: () => void;
  onViewDetails: () => void;
}


// Deprecated: ProductInfo is no longer used. Use ProductInfoPanel directly for each order item.
const ProductInfo: React.FC<ProductInfoProps> = () => null;

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
