import React from "react";
import { Plus } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  onAddClick: () => void;
};

const CreateOrderAddItemPanel: React.FC<Props> = ({ colors, onAddClick }) => (
  <div
    className="mt-4 p-5 rounded-xl border-2 border-dashed"
    style={{
      backgroundColor: colors.background.accent,
      borderColor: "#0068ff40",
    }}
  >
    <h5 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text.primary }}>
      <Plus className="w-4 h-4" style={{ color: "#0068ff" }} />
      Add Product to Order
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <div className="md:col-span-2">
        <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
          Product ID <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
          placeholder="e.g., PROD123"
          id="newProductId"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
          Product Name <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
          placeholder="e.g., Software License"
          id="newProductName"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
          Quantity <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
          min={1}
          defaultValue={1}
          id="newProductQty"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>
      <div>
        <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
          Price (₹) <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
          min={0}
          defaultValue={0}
          id="newProductPrice"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
      <div className="md:col-span-2">
        <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
          Discount (₹)
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition"
          min={0}
          placeholder="Optional"
          id="newProductDiscount"
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        />
      </div>
      <div className="md:col-span-4 flex items-end">
        <button
          type="button"
          className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200"
          style={{ background: "#0068ff", color: "#fff" }}
          onClick={onAddClick}
        >
          <Plus className="w-4 h-4" />
          Add to Order
        </button>
      </div>
    </div>
  </div>
);

export default CreateOrderAddItemPanel;
