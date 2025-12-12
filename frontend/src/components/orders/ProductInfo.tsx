import React from "react";
import { Package } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import type { IOrder } from "../../api/types/orderTypes";

interface ProductInfoProps {
  order: IOrder;
  onBuyAgain: () => void;
  onViewDetails: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = React.memo(
  ({ order, onBuyAgain, onViewDetails }) => {
    const { colors, theme } = useAdminTheme();
    const { formatPriceWithSymbol } = useCurrency();
    const product = order.items[0];

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div
            className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              backgroundColor: theme === 'dark' ? colors.background.tertiary : '#f3f4f6',
              border: `1.5px solid ${colors.border.primary}`
            }}
          >
            {product?.image &&
            product.image !== "null" &&
            product.image.trim() !== "" ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package
                className="w-8 h-8"
                style={{ color: theme === 'dark' ? '#fff' : colors.interactive.primary, opacity: 0.85 }}
              />
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 w-full">
          <h3
            className="font-bold text-base sm:text-lg mb-2"
            style={{ color: colors.text.primary }}
          >
            {product?.name || "Product"}
          </h3>

          {/* Product Details */}
          <div className="mb-4">
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Quantity:</span>{" "}
              {product?.quantity ?? 1}
            </div>
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Unit Price:</span>{" "}
              {formatPriceWithSymbol(product?.price || 0)}
            </div>
            <div
              className="text-xs sm:text-sm mb-1"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Payment Status:</span>{" "}
              {order.paymentStatus}
            </div>
            <div
              className="text-xs sm:text-sm"
              style={{ color: colors.text.secondary }}
            >
              <span className="font-medium">Order Date:</span>{" "}
              {formatDate(order.createdAt)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onBuyAgain}
              className="px-4 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors duration-200 w-full sm:w-auto"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            >
              BUY IT AGAIN
            </button>

            <button
              onClick={onViewDetails}
              className="px-4 py-2 rounded text-xs sm:text-sm font-semibold border transition-colors duration-200 w-full sm:w-auto"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.primary,
                borderColor: colors.border.primary,
              }}
            >
              VIEW DETAILS
            </button>
          </div>
        </div>
      </div>
    );
  },
);

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;
