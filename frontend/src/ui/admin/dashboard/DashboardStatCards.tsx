import { TrendingUp, Users, Package2, BarChart3 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { DashboardStats } from "./buildDashboardStats";

type Props = {
  colors: ThemeColors;
  stats: DashboardStats;
};

export function DashboardStatCards({ colors, stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Total Revenue
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
            <p
              className="text-sm flex items-center mt-1"
              style={{ color: colors.status.success }}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              From paid orders
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.background.accent }}
          >
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Total Products
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {stats.totalProducts}
            </p>
            <p
              className="text-sm"
              style={{ color: colors.interactive.primary }}
            >
              {stats.totalCategories} Categories
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.background.accent }}
          >
            <Package2
              className="w-6 h-6"
              style={{ color: colors.interactive.primary }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Registered Users
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {stats.totalUsers}
            </p>
            <p className="text-sm" style={{ color: colors.status.success }}>
              Registered Users
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.background.accent }}
          >
            <Users
              className="w-6 h-6"
              style={{ color: colors.status.success }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: colors.text.secondary }}
            >
              Total Orders
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: colors.text.primary }}
            >
              {stats.totalOrders}
            </p>
            <p
              className="text-sm"
              style={{
                color:
                  stats.todayOrders > 0
                    ? colors.status.success
                    : colors.text.secondary,
              }}
            >
              Today: {stats.todayOrders} orders
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colors.background.accent }}
          >
            <BarChart3
              className="w-6 h-6"
              style={{ color: colors.status.warning }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
