import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import type { IOrder } from "../../api/types/orderTypes";
import { useProductOrderDownload } from "./productInfo/useProductOrderDownload";
import { ProductInfoPanel } from "./productInfo/ProductInfoPanel";

interface ProductInfoProps {
  order: IOrder;
  onBuyAgain: () => void;
  onViewDetails: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = React.memo(
  ({ order, onBuyAgain: _onBuyAgain, onViewDetails: _onViewDetails }) => {
    const { colors, theme } = useAdminTheme();
    const { formatPriceWithSymbol } = useCurrency();
    const product = order.items[0];
    const download = useProductOrderDownload(order, product);

    return (
      <ProductInfoPanel
        order={order}
        product={product}
        colors={colors}
        theme={theme}
        formatPriceWithSymbol={formatPriceWithSymbol}
        download={download}
      />
    );
  },
);

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
