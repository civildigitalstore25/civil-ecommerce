import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";

type Props = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
};

export function AddProductModalDealDatetimeFields({ colors, newProduct, setNewProduct }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
          Deal Start Date & Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={newProduct.dealStartDate}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealStartDate: e.target.value }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            required={newProduct.isDeal}
          />
          <input
            type="time"
            value={newProduct.dealStartTime}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealStartTime: e.target.value }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            required={newProduct.isDeal}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
          Deal End Date & Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={newProduct.dealEndDate}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealEndDate: e.target.value }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            required={newProduct.isDeal}
          />
          <input
            type="time"
            value={newProduct.dealEndTime}
            onChange={(e) =>
              setNewProduct((prev) => ({ ...prev, dealEndTime: e.target.value }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            required={newProduct.isDeal}
          />
        </div>
      </div>
    </div>
  );
}
