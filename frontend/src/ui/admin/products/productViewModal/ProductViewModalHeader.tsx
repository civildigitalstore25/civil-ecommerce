import React from "react";
import { X, Award, CheckCircle, Circle } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";

type Props = {
  product: Product;
  onClose: () => void;
};

export const ProductViewModalHeader: React.FC<Props> = ({ product, onClose }) => {
  return (
    <div
      className="sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10 transition-colors duration-200"
      style={{
        backgroundColor: "white",
        borderBottomColor: "gray",
      }}
    >
      <div className="flex items-center space-x-3">
        <h2 className="text-2xl font-bold" style={{ color: "black" }}>
          Product Details
        </h2>
        {product.isBestSeller && (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: "gold",
              color: "black",
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
                  ? "green"
                  : product.status === "inactive"
                    ? "red"
                    : "orange",
              color: "white",
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
        style={{ color: "black" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "gray";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "black";
        }}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};
