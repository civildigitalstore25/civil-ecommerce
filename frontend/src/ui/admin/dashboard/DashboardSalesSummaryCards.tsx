import { TrendingUp } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { PeriodType } from "../../../api/analyticsApi";
import type { DashboardComparisonData } from "./buildDashboardComparisonData";

type Props = {
  colors: ThemeColors;
  period: PeriodType;
  comparisonData: DashboardComparisonData;
  averageOrderValue: number;
};

export function DashboardSalesSummaryCards({
  colors,
  period,
  comparisonData,
  averageOrderValue,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: colors.background.accent }}
      >
        <p
          className="text-sm font-medium mb-1"
          style={{ color: colors.text.secondary }}
        >
          Current Period Revenue
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          ₹{comparisonData.currentPeriodRevenue.toLocaleString("en-IN")}
        </p>
        {comparisonData.previousPeriodRevenue > 0 && (
          <>
            <p
              className="text-sm flex items-center mt-1"
              style={{
                color:
                  comparisonData.revenueChange >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  comparisonData.revenueChange < 0 ? "rotate-180" : ""
                }`}
              />
              {comparisonData.revenueChange >= 0 ? "+" : ""}
              {comparisonData.revenueChange.toFixed(1)}% from previous{" "}
              {period.slice(0, -2)}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color:
                  comparisonData.revenueChange >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              Difference: {comparisonData.revenueChange >= 0 ? "+" : ""}₹
              {(
                comparisonData.currentPeriodRevenue -
                comparisonData.previousPeriodRevenue
              ).toLocaleString("en-IN")}
            </p>
          </>
        )}
      </div>
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: colors.background.accent }}
      >
        <p
          className="text-sm font-medium mb-1"
          style={{ color: colors.text.secondary }}
        >
          Current Period Orders
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {comparisonData.currentPeriodOrders}
        </p>
        {comparisonData.previousPeriodOrders > 0 && (
          <>
            <p
              className="text-sm flex items-center mt-1"
              style={{
                color:
                  comparisonData.ordersChange >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  comparisonData.ordersChange < 0 ? "rotate-180" : ""
                }`}
              />
              {comparisonData.ordersChange >= 0 ? "+" : ""}
              {comparisonData.ordersChange.toFixed(1)}% from previous{" "}
              {period.slice(0, -2)}
            </p>
            <p
              className="text-xs mt-1"
              style={{
                color:
                  comparisonData.ordersChange >= 0
                    ? colors.status.success
                    : colors.status.error,
              }}
            >
              Difference: {comparisonData.ordersChange >= 0 ? "+" : ""}
              {comparisonData.currentPeriodOrders -
                comparisonData.previousPeriodOrders}
            </p>
          </>
        )}
      </div>
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: colors.background.accent }}
      >
        <p
          className="text-sm font-medium mb-1"
          style={{ color: colors.text.secondary }}
        >
          Average Order Value
        </p>
        <p
          className="text-2xl font-bold"
          style={{ color: colors.text.primary }}
        >
          ₹{Math.round(averageOrderValue).toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}
