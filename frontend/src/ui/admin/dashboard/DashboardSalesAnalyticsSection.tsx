import { BarChart3 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AnalyticsData, PeriodType } from "../../../api/analyticsApi";
import type { DashboardComparisonData } from "./buildDashboardComparisonData";
import { DashboardSalesToolbar } from "./DashboardSalesToolbar";
import { DashboardSalesSummaryCards } from "./DashboardSalesSummaryCards";
import { DashboardSalesComposedChart } from "./DashboardSalesComposedChart";

type Props = {
  colors: ThemeColors;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
  downloading: "excel" | "pdf" | null;
  onDownload: (format: "excel" | "pdf") => void;
  analyticsData: AnalyticsData | undefined;
  analyticsLoading: boolean;
  analyticsError: unknown;
  comparisonData: DashboardComparisonData;
};

export function DashboardSalesAnalyticsSection({
  colors,
  period,
  onPeriodChange,
  downloading,
  onDownload,
  analyticsData,
  analyticsLoading,
  analyticsError,
  comparisonData,
}: Props) {
  return (
    <div
      className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <DashboardSalesToolbar
        colors={colors}
        period={period}
        onPeriodChange={onPeriodChange}
        downloading={downloading}
        onDownload={onDownload}
        analyticsData={analyticsData}
      />

      {analyticsLoading ? (
        <div
          className="flex items-center justify-center h-96"
          style={{ color: colors.text.secondary }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: colors.interactive.primary }}
            />
            <p>Loading analytics data...</p>
          </div>
        </div>
      ) : analyticsError ? (
        <div
          className="flex items-center justify-center h-96"
          style={{ color: colors.status.error }}
        >
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Error loading analytics data</p>
            <p className="text-sm mt-2">
              {analyticsError instanceof Error
                ? analyticsError.message
                : "An unexpected error occurred"}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse,
              }}
            >
              Retry
            </button>
          </div>
        </div>
      ) : analyticsData && analyticsData.salesData.length > 0 ? (
        <>
          <DashboardSalesSummaryCards
            colors={colors}
            period={period}
            comparisonData={comparisonData}
            averageOrderValue={analyticsData.averageOrderValue}
          />
          <DashboardSalesComposedChart
            colors={colors}
            salesData={comparisonData.salesData}
          />
        </>
      ) : (
        <div
          className="flex items-center justify-center h-96"
          style={{ color: colors.text.secondary }}
        >
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No sales data available</p>
            <p className="text-sm mt-2">
              Sales data will appear here once you have orders
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
