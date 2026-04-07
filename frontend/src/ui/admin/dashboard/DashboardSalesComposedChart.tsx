import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { DashboardComparisonRow } from "./buildDashboardComparisonData";

type Props = {
  colors: ThemeColors;
  salesData: DashboardComparisonRow[];
};

export function DashboardSalesComposedChart({ colors, salesData }: Props) {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={salesData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.border.primary}
          />
          <XAxis
            dataKey="period"
            stroke={colors.text.secondary}
            style={{ fontSize: "0.875rem" }}
          />
          <YAxis
            yAxisId="left"
            stroke={colors.text.secondary}
            style={{ fontSize: "0.875rem" }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.text.secondary}
            style={{ fontSize: "0.875rem" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.border.primary}`,
              borderRadius: "0.5rem",
              color: colors.text.primary,
            }}
            formatter={(
              value: number | undefined,
              name: string | undefined,
              props: { payload?: DashboardComparisonRow },
            ) => {
              if (value === undefined || name === undefined) return ["", ""];
              const payload = props.payload;
              if (!payload) return [value, name];
              if (name === "Revenue") {
                const change = payload.revenueChange;
                const diff = payload.revenue - payload.previousRevenue;
                const changeText =
                  payload.previousRevenue > 0
                    ? ` (${change >= 0 ? "+" : ""}${change.toFixed(1)}%, ${change >= 0 ? "+" : ""}₹${diff.toLocaleString("en-IN")})`
                    : "";
                return [`₹${value.toLocaleString("en-IN")}${changeText}`, name];
              }
              if (name === "Orders") {
                const change = payload.ordersChange;
                const diff = payload.orderCount - payload.previousOrderCount;
                const changeText =
                  payload.previousOrderCount > 0
                    ? ` (${change >= 0 ? "+" : ""}${change.toFixed(1)}%, ${change >= 0 ? "+" : ""}${diff})`
                    : "";
                return [`${value}${changeText}`, name];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ color: colors.text.primary }}
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Revenue"
            fill={colors.interactive.primary}
            radius={[8, 8, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orderCount"
            name="Orders"
            stroke={colors.status.success}
            strokeWidth={3}
            dot={{ fill: colors.status.success, r: 5 }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
