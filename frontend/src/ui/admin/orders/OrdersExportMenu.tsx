import React from "react";
import { Download } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  exportOpen: boolean;
  setExportOpen: (v: boolean) => void;
  onExportExcel: () => void;
  onExportJSON: () => void;
};

const OrdersExportMenu: React.FC<Props> = ({
  colors,
  exportOpen,
  setExportOpen,
  onExportExcel,
  onExportJSON,
}) => (
  <div className="relative">
    <button
      type="button"
      className="px-4 py-2 rounded-lg font-medium flex items-center gap-2"
      style={{ background: "#00b814", color: "#fff" }}
      onClick={() => setExportOpen(!exportOpen)}
    >
      <Download className="w-4 h-4" />
      Export
    </button>
    {exportOpen && (
      <div
        className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 border"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <button
          type="button"
          className="w-full px-4 py-2 text-left hover:opacity-75 transition-opacity"
          style={{ color: colors.text.primary }}
          onClick={() => {
            onExportExcel();
            setExportOpen(false);
          }}
        >
          📊 Export to Excel
        </button>
        <button
          type="button"
          className="w-full px-4 py-2 text-left hover:opacity-75 transition-opacity border-t"
          style={{
            color: colors.text.primary,
            borderTopColor: colors.border.primary,
          }}
          onClick={() => {
            onExportJSON();
            setExportOpen(false);
          }}
        >
          📄 Export to JSON
        </button>
      </div>
    )}
  </div>
);

export default OrdersExportMenu;
