import React from "react";
import { Package, ShoppingCart } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderFormState } from "./useAdminOrderCreateForm";
import CreateOrderLineItemsList from "./CreateOrderLineItemsList";
import CreateOrderAddItemPanel from "./CreateOrderAddItemPanel";

type Props = {
  colors: ThemeColors;
  orderForm: AdminOrderFormState;
  onRemoveItem: (productId: string) => void;
  onItemChange: (productId: string, field: string, value: string | number | undefined) => void;
  onAddProductClick: () => void;
};

const CreateOrderItemsSection: React.FC<Props> = ({
  colors,
  orderForm,
  onRemoveItem,
  onItemChange,
  onAddProductClick,
}) => (
  <div
    className="p-5 rounded-xl border"
    style={{
      backgroundColor: colors.background.primary,
      borderColor: colors.border.primary,
    }}
  >
    <h4
      className="font-semibold text-lg mb-4 flex items-center justify-between"
      style={{ color: colors.text.primary }}
    >
      <span className="flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" style={{ color: "#0068ff" }} />
        Order Items ({orderForm.items.length})
      </span>
    </h4>

    {orderForm.items.length === 0 ? (
      <div
        className="text-center py-8 rounded-lg border-2 border-dashed"
        style={{
          borderColor: colors.border.primary,
          color: colors.text.secondary,
        }}
      >
        <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p>No products added yet. Add products below to continue.</p>
      </div>
    ) : (
      <CreateOrderLineItemsList
        colors={colors}
        items={orderForm.items}
        onRemoveItem={onRemoveItem}
        onItemChange={onItemChange}
      />
    )}

    <CreateOrderAddItemPanel colors={colors} onAddClick={onAddProductClick} />
  </div>
);

export default CreateOrderItemsSection;
