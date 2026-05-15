import React from "react";
import { Download } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  totalExpiredCount: number;
  onExportExcel?: () => void;
  onExportJSON?: () => void;
};

const ExpiryPageToolbar: React.FC<Props> = ({
  colors,
  totalExpiredCount,
  onExportExcel,
  onExportJSON,
}) => (
  <div
    className="rounded-xl shadow-sm border p-6 transition-colors duration-200"
    style={{
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.primary,
    }}
  >
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2
          className="text-lg font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          License Expiry Management
        </h2>
        <p
          className="text-sm transition-colors duration-200 mt-1"
          style={{ color: colors.text.secondary }}
        >
          Total expired licenses: {totalExpiredCount}
        </p>
      </div>

      <div className="flex gap-3">
        {onExportExcel && (
          <button
            onClick={onExportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        )}

        {onExportJSON && (
          <button
            onClick={onExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ExpiryPageToolbar;
