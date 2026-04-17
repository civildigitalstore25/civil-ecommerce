import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";

type Props = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
};

export function AddProductModalDealAdminSubscriptionsPricing({
  colors,
  newProduct,
  setNewProduct,
}: Props) {
  if (newProduct.brand === "ebook" || newProduct.subscriptions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium" style={{ color: colors.text.primary }}>
        Admin Subscription Deal Pricing
      </h3>
      {newProduct.subscriptions.map((sub, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border space-y-3"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="font-medium text-sm" style={{ color: colors.text.primary }}>
            {sub.duration} Plan - Deal Price
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                Deal Price (INR) ₹
              </label>
              <input
                type="number"
                value={newProduct.dealSubscriptions[index]?.priceINR || ""}
                onChange={(e) => {
                  const updatedDeals = [...newProduct.dealSubscriptions];
                  if (!updatedDeals[index]) {
                    updatedDeals[index] = {
                      duration: sub.duration,
                      price: "",
                      priceINR: "",
                      priceUSD: "",
                    };
                  }
                  updatedDeals[index].priceINR = e.target.value;
                  setNewProduct((prev) => ({ ...prev, dealSubscriptions: updatedDeals }));
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
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
                value={newProduct.dealSubscriptions[index]?.priceUSD || ""}
                onChange={(e) => {
                  const updatedDeals = [...newProduct.dealSubscriptions];
                  if (!updatedDeals[index]) {
                    updatedDeals[index] = {
                      duration: sub.duration,
                      price: "",
                      priceINR: "",
                      priceUSD: "",
                    };
                  }
                  updatedDeals[index].priceUSD = e.target.value;
                  setNewProduct((prev) => ({ ...prev, dealSubscriptions: updatedDeals }));
                }}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
