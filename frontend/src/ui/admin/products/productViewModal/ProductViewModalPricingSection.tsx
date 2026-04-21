import React from "react";
import { DollarSign } from "lucide-react";
import type { Product } from "../../../../api/types/productTypes";
import { buildAdminProductPricingGroups } from "../adminProductPricingDisplay";
import { useProductViewModalTheme } from "./useProductViewModalTheme";

type Props = {
  product: Product;
};

/**
 * Uses the same pricing grouping as {@link ProductTablePricingCell} so the modal
 * never omits tiers that appear in the admin table (e.g. subscriptions vs
 * subscriptionDurations, INR 0 vs legacy price).
 */
export const ProductViewModalPricingSection: React.FC<Props> = ({ product }) => {
  const t = useProductViewModalTheme();
  const groups = buildAdminProductPricingGroups(product);

  return (
    <div
      className="rounded-lg p-6 mb-8 border transition-colors duration-200"
      style={{ ...t.surface, borderColor: t.borderColor }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center" style={t.heading}>
        <DollarSign className="w-6 h-6 mr-2" />
        Pricing plans
      </h3>

      {groups.length === 0 ? (
        <p className="text-sm" style={t.muted}>
          No pricing configured for this product.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-lg font-medium mb-3" style={t.heading}>
                {group.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {group.lines.map((line) => (
                  <div
                    key={`${group.title}-${line.label}`}
                    className="rounded-lg p-4 border transition-colors duration-200"
                    style={{ ...t.surface, borderColor: t.borderColor }}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={t.heading}>
                        ₹{line.price.toLocaleString()}
                      </div>
                      <div className="text-sm mt-1" style={t.muted}>
                        {line.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
