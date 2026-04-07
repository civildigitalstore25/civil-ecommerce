import type { Dispatch, SetStateAction } from "react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { ProductForm } from "../../../../constants/productFormConstants";
import { AddProductModalDealAdminSubscriptionsPricing } from "./AddProductModalDealAdminSubscriptionsPricing";
import { AddProductModalDealDatetimeFields } from "./AddProductModalDealDatetimeFields";
import { AddProductModalDealEbookPricing } from "./AddProductModalDealEbookPricing";
import { AddProductModalDealLifetimePricing } from "./AddProductModalDealLifetimePricing";
import { AddProductModalDealMembershipPricing } from "./AddProductModalDealMembershipPricing";
import { AddProductModalDealSubscriptionDurationsPricing } from "./AddProductModalDealSubscriptionDurationsPricing";

type Props = {
  colors: ThemeColors;
  newProduct: ProductForm;
  setNewProduct: Dispatch<SetStateAction<ProductForm>>;
};

export function AddProductModalDealSection({ colors, newProduct, setNewProduct }: Props) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        🎉 Deal / Discount Configuration
      </h2>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isDeal"
          checked={newProduct.isDeal}
          onChange={(e) =>
            setNewProduct((prev) => ({ ...prev, isDeal: e.target.checked }))
          }
          className="w-4 h-4 rounded focus:ring-2"
          style={{ accentColor: colors.interactive.primary }}
        />
        <label
          htmlFor="isDeal"
          className="text-sm font-medium cursor-pointer"
          style={{ color: colors.text.secondary }}
        >
          Enable Deal/Discount Pricing
        </label>
      </div>

      {newProduct.isDeal && (
        <div
          className="space-y-6 p-4 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <AddProductModalDealDatetimeFields
            colors={colors}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />

          {newProduct.brand === "ebook" && (
            <AddProductModalDealEbookPricing
              colors={colors}
              newProduct={newProduct}
              setNewProduct={setNewProduct}
            />
          )}

          <AddProductModalDealSubscriptionDurationsPricing
            colors={colors}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />

          <AddProductModalDealLifetimePricing
            colors={colors}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />

          <AddProductModalDealMembershipPricing
            colors={colors}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />

          <AddProductModalDealAdminSubscriptionsPricing
            colors={colors}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm" style={{ color: colors.text.secondary }}>
              💡 <strong>Tip:</strong> Set deal prices lower than regular prices to attract customers. The deal
              will automatically start and end at the specified date and time. Products will show in the Deals menu
              only during active deal period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
