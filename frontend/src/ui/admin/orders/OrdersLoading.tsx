import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = { colors: ThemeColors };

const OrdersLoading: React.FC<Props> = ({ colors }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
        style={{ borderColor: colors.interactive.primary }}
      />
      <p style={{ color: colors.text.secondary }}>Loading orders...</p>
    </div>
  </div>
);

export default OrdersLoading;
