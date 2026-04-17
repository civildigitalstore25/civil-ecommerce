import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";

type Props = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
};

export function AddProductModalDealLifetimePricing({ colors, newProduct, setNewProduct }: Props) {
  if (newProduct.brand === "ebook" || !newProduct.hasLifetime) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium" style={{ color: colors.text.primary }}>
        Lifetime Deal Pricing
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Deal Price (INR) ₹
          </label>
          <input
            type="number"
            value={newProduct.dealLifetimePriceINR}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealLifetimePriceINR: e.target.value }))
            }
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Deal Price (USD) $
          </label>
          <input
            type="number"
            value={newProduct.dealLifetimePriceUSD}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealLifetimePriceUSD: e.target.value }))
            }
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>
      </div>
    </div>
  );
}
