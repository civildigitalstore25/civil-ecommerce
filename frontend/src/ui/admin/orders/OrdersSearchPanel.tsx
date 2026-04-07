import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  searchTerm: string;
  onSearchChange: (v: string) => void;
};

const OrdersSearchPanel: React.FC<Props> = ({ colors, searchTerm, onSearchChange }) => (
  <div
    className="rounded-lg p-4 border"
    style={{
      background: colors.background.primary,
      borderColor: colors.border.primary,
    }}
  >
    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
      Search by Customer Name or Email
    </label>
    <input
      type="text"
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
        color: colors.text.primary,
      }}
      placeholder="Enter customer name or email..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  </div>
);

export default OrdersSearchPanel;
