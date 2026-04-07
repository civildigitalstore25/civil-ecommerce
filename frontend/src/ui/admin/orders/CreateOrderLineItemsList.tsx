import React from "react";
import { Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { IOrderItem } from "../../../api/types/orderTypes";

type Props = {
  colors: ThemeColors;
  items: IOrderItem[];
  onRemoveItem: (productId: string) => void;
  onItemChange: (productId: string, field: string, value: string | number | undefined) => void;
};

const CreateOrderLineItemsList: React.FC<Props> = ({
  colors,
  items,
  onRemoveItem,
  onItemChange,
}) => (
  <div className="space-y-3 mb-4">
    {items.map((item) => (
      <div
        key={item.productId}
        className="product-item-card p-4 rounded-lg border"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>
                Product Name
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
                placeholder="Product Name"
                value={item.name}
                onChange={(e) => onItemChange(item.productId, "name", e.target.value)}
                style={{
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>
                Quantity
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
                min={1}
                value={item.quantity}
                onChange={(e) => onItemChange(item.productId, "quantity", Number(e.target.value))}
                style={{
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>
                Price (₹)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
                min={0}
                value={item.price}
                onChange={(e) => onItemChange(item.productId, "price", Number(e.target.value))}
                style={{
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>
                Discount (₹)
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
                min={0}
                placeholder="0"
                value={item.discount === undefined ? "" : item.discount}
                onChange={(e) =>
                  onItemChange(
                    item.productId,
                    "discount",
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
                style={{
                  color: colors.text.primary,
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              />
            </div>
          </div>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-all duration-200 mt-6"
            onClick={() => onRemoveItem(item.productId)}
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
          </button>
        </div>
        <div className="mt-2 text-xs flex items-center gap-2" style={{ color: colors.text.secondary }}>
          <span>Total: ₹{(item.price * item.quantity - (item.discount || 0)).toLocaleString()}</span>
        </div>
      </div>
    ))}
  </div>
);

export default CreateOrderLineItemsList;
