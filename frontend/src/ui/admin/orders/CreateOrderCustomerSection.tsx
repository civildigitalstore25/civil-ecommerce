import React from "react";
import { User } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderFormState } from "./useAdminOrderCreateForm";

type Props = {
  colors: ThemeColors;
  orderForm: AdminOrderFormState;
  setOrderForm: React.Dispatch<React.SetStateAction<AdminOrderFormState>>;
};

const CreateOrderCustomerSection: React.FC<Props> = ({ colors, orderForm, setOrderForm }) => (
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
      <User className="w-5 h-5" style={{ color: "#0068ff" }} />
      Customer Information
    </h4>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
          Customer Email <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
          type="email"
          placeholder="customer@example.com"
          value={orderForm.email || ""}
          onChange={(e) => setOrderForm((f) => ({ ...f, email: e.target.value }))}
          style={{
            color: colors.text.primary,
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        />
        <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
          Enter the customer&apos;s email address for order notifications
        </p>
      </div>
    </div>
  </div>
);

export default CreateOrderCustomerSection;
