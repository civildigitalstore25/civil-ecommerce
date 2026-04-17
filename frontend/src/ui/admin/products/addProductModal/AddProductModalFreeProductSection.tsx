import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";

type Props = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
};

export function AddProductModalFreeProductSection({ colors, newProduct, setNewProduct }: Props) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        🎁 Free Product (Homepage)
      </h2>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isFreeProduct"
          checked={newProduct.isFreeProduct}
          onChange={(e) => {
            const checked = e.target.checked;
            setNewProduct((prev) => {
              if (!checked) {
                return { ...prev, isFreeProduct: false };
              }
              return {
                ...prev,
                isFreeProduct: true,
                freeProductStartTime:
                  prev.freeProductStartTime.trim() !== "" ? prev.freeProductStartTime : "00:00",
                freeProductEndTime:
                  prev.freeProductEndTime.trim() !== "" ? prev.freeProductEndTime : "23:59",
              };
            });
          }}
          className="w-4 h-4 rounded focus:ring-2"
          style={{ accentColor: colors.interactive.primary }}
        />
        <label
          htmlFor="isFreeProduct"
          className="text-sm font-medium cursor-pointer"
          style={{ color: colors.text.secondary }}
        >
          Free product (show on homepage for limited time, ₹0 – no payment gateway)
        </label>
      </div>
      {newProduct.isFreeProduct && (
        <div
          className="space-y-6 p-4 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                Free product start date & time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newProduct.freeProductStartDate}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, freeProductStartDate: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  required={newProduct.isFreeProduct}
                />
                <input
                  type="time"
                  value={newProduct.freeProductStartTime}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, freeProductStartTime: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                Free product end date & time
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newProduct.freeProductEndDate}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, freeProductEndDate: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  required={newProduct.isFreeProduct}
                />
                <input
                  type="time"
                  value={newProduct.freeProductEndTime}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, freeProductEndTime: e.target.value }))
                  }
                  className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            💡 During this window the storefront shows <strong>₹0</strong> and checkout skips the payment gateway.{" "}
            <strong>List prices you set above are saved as usual</strong> so the admin grid and post-promo pricing
            stay correct; you can edit them anytime, even while this is checked.
          </p>
        </div>
      )}
    </div>
  );
}
