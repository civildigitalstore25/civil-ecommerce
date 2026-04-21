import React from "react";
import { X, Award, CheckCircle, Circle } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
  onClose: () => void;
};

export const ProductViewModalHeader: React.FC<Props> = ({ product, onClose }) => {
  const t = useProductViewModalTheme();
  const { colors } = t;

  return (
    <div
      className="sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10 transition-colors duration-200"
      style={{
        ...t.surface,
        borderBottomColor: t.borderColor,
      }}
    >
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold" style={t.heading}>
          Product Details
        </h2>
        {product.isBestSeller && (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: t.isDark ? "rgba(234, 179, 8, 0.35)" : "#facc15",
              color: colors.text.primary,
            }}
          >
            <Award className="w-4 h-4 mr-1" />
            Best Seller
          </span>
        )}
        {product.status && (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor:
                product.status === "active"
                  ? colors.status.success
                  : product.status === "inactive"
                    ? colors.status.error
                    : colors.status.warning,
              color: "#ffffff",
            }}
          >
            {product.status === "active" && <CheckCircle className="w-3 h-3 mr-1" />}
            {product.status === "inactive" && <Circle className="w-3 h-3 mr-1" />}
            {product.status === "draft" && <Circle className="w-3 h-3 mr-1" />}
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="transition-colors"
        style={t.muted}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = colors.text.secondary;
        }}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
