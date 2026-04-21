import React from "react";
import { FileText } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderFormState } from "./useAdminOrderCreateForm";
import { sumItemsGross, sumLineDiscounts } from "./orderCreateFormMoney";

type Props = {
  colors: ThemeColors;
  orderForm: AdminOrderFormState;
  setOrderForm: React.Dispatch<React.SetStateAction<AdminOrderFormState>>;
};

const CreateOrderNotesSummarySection: React.FC<Props> = ({ colors, orderForm, setOrderForm }) => {
  const gross = sumItemsGross(orderForm.items);
  const lineDisc = sumLineDiscounts(orderForm.items);

  return (
  <>
    <div
      className="p-5 rounded-xl border"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <h4
        className="font-semibold text-lg mb-4 flex items-center gap-2"
        style={{ color: colors.text.primary }}
      >
        <FileText className="w-5 h-5" style={{ color: "#0068ff" }} />
        Additional Details
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
            Total Discount (₹)
          </label>
          <input
            type="number"
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
            min={0}
            placeholder="0"
            value={orderForm.discount || ""}
            onChange={(e) =>
              setOrderForm((f) => ({
                ...f,
                discount: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            style={{
              color: colors.text.primary,
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          />
          <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
            Additional discount on the entire order
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
            Order Notes
          </label>
          <textarea
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 resize-none"
            placeholder="Add any special notes or instructions..."
            rows={3}
            value={orderForm.notes || ""}
            onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))}
            style={{
              color: colors.text.primary,
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          />
        </div>
      </div>
    </div>

    <div
      className="p-5 rounded-xl border-2"
      style={{
        backgroundColor: colors.background.accent,
        borderColor: "#0068ff40",
      }}
    >
      <h4 className="font-semibold text-lg mb-4" style={{ color: colors.text.primary }}>
        Order Summary
      </h4>
      <div className="space-y-3">
        {orderForm.items.length > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: colors.text.secondary }}>Items (before line discounts):</span>
            <span className="font-medium" style={{ color: colors.text.primary }}>
              ₹{gross.toLocaleString()}
            </span>
          </div>
        )}
        {lineDisc > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span style={{ color: colors.text.secondary }}>Line item discounts:</span>
            <span className="font-medium" style={{ color: "#ef4444" }}>
              -₹{lineDisc.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span style={{ color: colors.text.secondary }}>Subtotal:</span>
          <span className="font-semibold text-lg" style={{ color: colors.text.primary }}>
            ₹{orderForm.subtotal.toLocaleString()}
          </span>
        </div>
        {orderForm.discount != null && orderForm.discount > 0 && (
          <div className="flex justify-between items-center">
            <span style={{ color: colors.text.secondary }}>Order discount:</span>
            <span className="font-semibold" style={{ color: "#ef4444" }}>
              -₹{orderForm.discount.toLocaleString()}
            </span>
          </div>
        )}
        <div
          className="pt-3 border-t flex justify-between items-center"
          style={{ borderColor: colors.border.primary }}
        >
          <span className="font-semibold text-lg" style={{ color: colors.text.primary }}>
            Total Amount:
          </span>
          <span className="font-bold text-2xl" style={{ color: "#0068ff" }}>
            ₹{orderForm.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </>
  );
};

export default CreateOrderNotesSummarySection;
