import React from "react";
import { Calendar } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { formatViewModalDate } from "./productViewModalFormat";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
};

export const ProductViewModalMetadata: React.FC<Props> = ({ product }) => {
  const t = useProductViewModalTheme();

  return (
    <div
      className="rounded-lg p-6 border transition-colors duration-200"
      style={{ ...t.surface, borderColor: t.borderColor }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
        <Calendar className="w-6 h-6 mr-2" style={t.accentIcon} />
        Metadata
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-sm font-medium" style={t.muted}>
            Created at
          </span>
          <p style={t.body}>{formatViewModalDate(product.createdAt)}</p>
        </div>
        <div>
          <span className="text-sm font-medium" style={t.muted}>
            Updated at
          </span>
          <p style={t.body}>{formatViewModalDate(product.updatedAt)}</p>
        </div>
        <div>
          <span className="text-sm font-medium" style={t.muted}>
            Product ID
          </span>
          <p className="font-mono text-sm px-2 py-1 rounded" style={t.metadataCode}>
            {product._id || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};
