import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Product } from "../../../api/types/productTypes";
import { buildAdminProductPricingGroups } from "./adminProductPricingDisplay";

type Props = {
  colors: ThemeColors;
  product: Product;
};

const ProductTablePricingCell: React.FC<Props> = ({ colors, product }) => {
  const groups = buildAdminProductPricingGroups(product);
  if (groups.length === 0) {
    return (
      <div className="text-xs" style={{ color: colors.text.secondary }}>
        —
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div key={group.title} className="space-y-1">
          <div
            className="text-[11px] font-semibold"
            style={{ color: colors.text.secondary }}
          >
            {group.title}
          </div>
          {group.lines.map((line) => (
            <div
              key={`${group.title}-${line.label}`}
              className="flex items-center justify-between gap-3"
            >
              <div
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                {line.label}
              </div>
              <div
                className="font-medium text-sm"
                style={{ color: colors.text.primary }}
              >
                ₹{line.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProductTablePricingCell;
