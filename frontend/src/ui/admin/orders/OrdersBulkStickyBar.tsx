import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  selectedCount: number;
  bulkStatusDropdown: string;
  onBulkStatusChange: (v: string) => void;
  onApplyBulk: () => void;
  onClear: () => void;
  bulkPending: boolean;
};

const OrdersBulkStickyBar: React.FC<Props> = ({
  colors,
  selectedCount,
  bulkStatusDropdown,
  onBulkStatusChange,
  onApplyBulk,
  onClear,
  bulkPending,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 md:top-6 md:right-6">
      <div
        className="rounded-xl border px-4 py-3 shadow-lg flex items-center gap-3"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
          {selectedCount} selected
        </span>
        <select
          className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          value={bulkStatusDropdown}
          onChange={(e) => onBulkStatusChange(e.target.value)}
        >
          <option value="">Status</option>
          <option value="processing">Processing</option>
          <option value="success">Success</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          type="button"
          className="px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          style={{ background: "#0068ff", color: "#fff" }}
          onClick={onApplyBulk}
          disabled={!bulkStatusDropdown || bulkPending}
        >
          Update Status
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg font-medium"
          style={{ background: "#999", color: "#fff" }}
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default OrdersBulkStickyBar;
