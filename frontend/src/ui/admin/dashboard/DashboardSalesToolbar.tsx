import { Download } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AnalyticsData, PeriodType } from "../../../api/analyticsApi";

type Props = {
  colors: ThemeColors;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
  downloading: "excel" | "pdf" | null;
  onDownload: (format: "excel" | "pdf") => void;
  analyticsData: AnalyticsData | undefined;
};

const PERIODS: PeriodType[] = ["weekly", "monthly", "yearly"];

export function DashboardSalesToolbar({
  colors,
  period,
  onPeriodChange,
  downloading,
  onDownload,
  analyticsData,
}: Props) {
  const hasData = analyticsData && analyticsData.salesData.length > 0;
  const disabled = downloading !== null || !hasData;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h3
        className="text-xl font-semibold mb-4 sm:mb-0"
        style={{ color: colors.text.primary }}
      >
        Sales Analytics
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="inline-flex rounded-lg p-1"
          style={{
            backgroundColor: colors.background.accent,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPeriodChange(p)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize"
              style={{
                backgroundColor:
                  period === p ? colors.interactive.primary : "transparent",
                color: period === p ? "#22c55e" : colors.text.secondary,
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onDownload("excel")}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                downloading === "excel" ? colors.background.accent : "#22c55e",
              color: "#000000",
              border: `1px solid ${colors.border.primary}`,
            }}
            title="Download as Excel"
          >
            {downloading === "excel" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Excel</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDownload("pdf")}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                downloading === "pdf" ? colors.background.accent : "#ef4444",
              color: "#000000",
              border: `1px solid ${colors.border.primary}`,
            }}
            title="Download as PDF"
          >
            {downloading === "pdf" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
