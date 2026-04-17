import React from "react";
import { Plus, RefreshCcw } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  onRefresh: () => void;
  onAdd: () => void;
};

const CouponsHeader: React.FC<Props> = ({ colors, theme, onRefresh, onAdd }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2
        className="text-2xl font-semibold"
        style={{ color: theme === "dark" ? "#fff" : colors.text.primary }}
      >
        Coupon Management
      </h2>
      <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
        Manage discount coupons for your store
      </p>
    </div>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onRefresh}
        className="flex items-center gap-2 px-4 py-2 rounded font-medium hover:opacity-90 transition"
        style={{
          background: "#0068ff",
          color: "#fff",
          border: "none",
        }}
        title="Refresh coupons"
      >
        <RefreshCcw size={16} />
        Refresh
      </button>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 rounded font-medium hover:opacity-90 transition"
        style={{
          background: "#0068ff",
          color: "#fff",
          border: "none",
        }}
      >
        <Plus size={16} />
        Add Coupon
      </button>
    </div>
  </div>
);

export default CouponsHeader;
