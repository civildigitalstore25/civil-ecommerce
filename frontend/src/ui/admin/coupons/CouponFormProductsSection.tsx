import React from "react";
import { X } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { CouponFormPayload, ProductOption } from "./types";

type CategoryGroup = { category: string; products: ProductOption[] };

type Props = {
  colors: ThemeColors;
  formData: CouponFormPayload;
  setFormData: React.Dispatch<React.SetStateAction<CouponFormPayload>>;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  categoryNames: string[];
  productsByCategory: CategoryGroup[];
  allProducts: ProductOption[];
};

const CouponFormProductsSection: React.FC<Props> = ({
  colors,
  formData,
  setFormData,
  categoryFilter,
  setCategoryFilter,
  categoryNames,
  productsByCategory,
  allProducts,
}) => {
  const toggleProductSelection = (productId: string) => {
    setFormData((prev) => {
      const ids = prev.applicableProductIds.includes(productId)
        ? prev.applicableProductIds.filter((id) => id !== productId)
        : [...prev.applicableProductIds, productId];
      return { ...prev, applicableProductIds: ids };
    });
  };

  const removeSelectedProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableProductIds: prev.applicableProductIds.filter((id) => id !== productId),
    }));
  };

  const getProductName = (id: string) => allProducts.find((p) => p._id === id)?.name || id;

  const groupsToShow = categoryFilter
    ? productsByCategory.filter((g) => g.category === categoryFilter)
    : productsByCategory;

  return (
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: colors.text.primary }}>
        Applicable products
      </label>
      <p className="text-xs mb-2" style={{ color: colors.text.secondary }}>
        Leave empty for site-wide coupon. Pick a category below, then tick products. Selected
        products can be removed from the chips.
      </p>
      <div className="mb-2">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm"
          style={{
            borderColor: colors.border.primary,
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
          }}
        >
          <option value="">All categories</option>
          {categoryNames.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div
        className="border rounded overflow-y-auto mb-3"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.secondary || colors.background.primary,
          maxHeight: "200px",
        }}
      >
        {groupsToShow.map(({ category, products: categoryProducts }) => (
          <div key={category} className="p-2">
            <div
              className="text-xs font-semibold uppercase tracking-wide mb-1.5 px-1"
              style={{ color: colors.text.secondary }}
            >
              {category}
            </div>
            <div className="space-y-1">
              {categoryProducts.map((p) => {
                const isChecked = formData.applicableProductIds.includes(p._id);
                return (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:opacity-90"
                    style={{
                      backgroundColor: isChecked
                        ? colors.interactive.primary + "18"
                        : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleProductSelection(p._id)}
                      className="rounded"
                      style={{ accentColor: colors.interactive.primary }}
                    />
                    <span className="text-sm" style={{ color: colors.text.primary }}>
                      {p.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {formData.applicableProductIds.length > 0 && (
        <div>
          <div className="text-xs font-medium mb-1.5" style={{ color: colors.text.secondary }}>
            Selected ({formData.applicableProductIds.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.applicableProductIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: colors.interactive.primary + "25",
                  color: colors.text.primary,
                  border: `1px solid ${colors.interactive.primary}40`,
                }}
              >
                {getProductName(id)}
                <button
                  type="button"
                  onClick={() => removeSelectedProduct(id)}
                  className="rounded-full p-0.5 hover:opacity-80 focus:outline-none"
                  style={{ color: colors.text.secondary }}
                  aria-label="Remove"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponFormProductsSection;
