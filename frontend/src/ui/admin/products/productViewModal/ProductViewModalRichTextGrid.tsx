import React from "react";
import { Monitor, Package, Zap } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { ProductViewModalRichContent } from "./ProductViewModalRichContent";

type Props = {
  product: Product;
};

export const ProductViewModalRichTextGrid: React.FC<Props> = ({ product }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="rounded-lg p-6" style={{ backgroundColor: "white" }}>
        <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
          <Package className="w-6 h-6 mr-2" />
          Description
        </h3>
        <ProductViewModalRichContent htmlContent={product.description} />
      </div>

      {product.overallFeatures && (
        <div className="rounded-lg p-6" style={{ backgroundColor: "white" }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
            <Zap className="w-6 h-6 mr-2" />
            Features
          </h3>
          <ProductViewModalRichContent htmlContent={product.overallFeatures} />
        </div>
      )}

      {product.requirements && (
        <div className="rounded-lg p-6" style={{ backgroundColor: "lightgray" }}>
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: "black" }}>
            <Monitor className="w-6 h-6 mr-2" />
            System Requirements
          </h3>
          <ProductViewModalRichContent htmlContent={product.requirements} />
        </div>
      )}
    </div>
  );
};
