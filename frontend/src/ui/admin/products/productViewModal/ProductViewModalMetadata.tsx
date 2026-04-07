import React from "react";
import { Calendar } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { formatViewModalDate } from "./productViewModalFormat";

type Props = {
  product: Product;
};

export const ProductViewModalMetadata: React.FC<Props> = ({ product }) => {
  return (
    <div
      className="rounded-lg p-6 transition-colors duration-200"
      style={{ backgroundColor: "white" }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
        <Calendar className="w-6 h-6 mr-2" style={{ color: "blue" }} />
        Metadata
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-sm font-medium" style={{ color: "gray" }}>
            Created At
          </span>
          <p style={{ color: "black" }}>{formatViewModalDate(product.createdAt)}</p>
        </div>
        <div>
          <span className="text-sm font-medium" style={{ color: "gray" }}>
            Updated At
          </span>
          <p style={{ color: "black" }}>{formatViewModalDate(product.updatedAt)}</p>
        </div>
        <div>
          <span className="text-sm font-medium" style={{ color: "gray" }}>
            Product ID
          </span>
          <p className="font-mono text-sm px-2 py-1 rounded bg-gray-100" style={{ color: "black" }}>
            {product._id || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
