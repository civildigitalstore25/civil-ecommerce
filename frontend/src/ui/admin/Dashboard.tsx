import React, { useMemo, useState } from "react";
import { TrendingUp, Users, Package2, BarChart3, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useProducts } from "../../api/productApi";
import { getAllOrders } from "../../api/adminOrderApi";
import {
  getSalesAnalytics,
  downloadSalesExcel,
  downloadSalesPDF,
} from "../../api/analyticsApi";
import type { PeriodType } from "../../api/analyticsApi";
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
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Dashboard: React.FC = () => {
  const { colors } = useAdminTheme();
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [downloading, setDownloading] = useState<"excel" | "pdf" | null>(null);

  // Fetch products
  const { data: productsData } = useProducts({ limit: 1000 });

  // Fetch orders
  const { data: ordersData } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => getAllOrders({ limit: 1000 }),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Fetch users count
  const { data: usersData } = useQuery({
    queryKey: ["usersCount"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 60000, // Auto-refresh every minute
  });

  // Fetch sales analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["salesAnalytics", period],
    queryFn: () => getSalesAnalytics(period),
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const products = productsData?.products || [];
    const orders = ordersData?.data?.orders || [];
    const users = usersData?.users || [];

    // Calculate total revenue
    const totalRevenue = orders
      .filter((order: any) => order.paymentStatus === "paid")
      .reduce((sum: number, order: any) => sum + order.totalAmount, 0);

    // Count orders by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;

    // Get unique categories
    const categories = [...new Set(products.map((p: any) => p.category))];

    // Get companies with product counts
    const companyCounts: Record<string, number> = {};
    products.forEach((product: any) => {
      const company = product.company || "Unknown";
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    });

    // Get category counts
    const categoryCounts: Record<string, number> = {};
    products.forEach((product: any) => {
      const category = product.category || "Unknown";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return {
      totalRevenue,
      totalProducts: products.length,
      totalCategories: categories.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      todayOrders,
      topCompanies: Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, products: count })),
      topCategories: Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([name, count]) => ({ name, products: count })),
    };
  }, [productsData, ordersData, usersData]);

  const handleDownload = async (format: "excel" | "pdf") => {
    try {
      setDownloading(format);
      if (format === "excel") {
        await downloadSalesExcel(period);
      } else {
        await downloadSalesPDF(period);
      }
    } catch (error) {
      console.error(`Error downloading ${format}:`, error);
      alert(`Failed to download ${format.toUpperCase()} file`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Sales Analytics Chart Section */}
      <div
        className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3
            className="text-xl font-semibold mb-4 sm:mb-0"
            style={{ color: colors.text.primary }}
          >
            Sales Analytics
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Toggle */}
            <div
              className="inline-flex rounded-lg p-1"
              style={{
                backgroundColor: colors.background.accent,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              {(["weekly", "monthly", "yearly"] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize"
                  style={{
                    backgroundColor:
                      period === p
                        ? colors.interactive.primary
                        : "transparent",
                    color:
                      period === p
                        ? "#22c55e"
                        : colors.text.secondary,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload("excel")}
                disabled={downloading !== null || !analyticsData || analyticsData.salesData.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: downloading === "excel" ? colors.background.accent : "#22c55e",
                  color: "#000000",
                  border: `1px solid ${colors.border.primary}`,
                }}
                title="Download as Excel"
              >
                {downloading === "excel" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
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
                onClick={() => handleDownload("pdf")}
                disabled={downloading !== null || !analyticsData || analyticsData.salesData.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: downloading === "pdf" ? colors.background.accent : "#ef4444",
                  color: "#000000",
                  border: `1px solid ${colors.border.primary}`,
                }}
                title="Download as PDF"
              >
                {downloading === "pdf" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
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

        {analyticsLoading ? (
          <div
            className="flex items-center justify-center h-96"
            style={{ color: colors.text.secondary }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: colors.interactive.primary }}
              ></div>
              <p>Loading analytics data...</p>
            </div>
          </div>
        ) : analyticsData && analyticsData.salesData.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: colors.background.accent }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  Total Revenue
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  ₹{analyticsData.totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: colors.background.accent }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: colors.text.secondary }}
                >
                  Total Orders
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  {analyticsData.totalOrders}
                </p>
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
                  ₹{Math.round(analyticsData.averageOrderValue).toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={analyticsData.salesData}
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
                    formatter={(value: number | undefined, name: string | undefined) => {
                      if (value === undefined || name === undefined) return ["", ""];
                      if (name === "Revenue") {
                        return [`₹${value.toLocaleString("en-IN")}`, name];
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

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Top Product Categories
          </h3>
          <div className="space-y-3">
            {stats.topCategories.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className="font-medium"
                  style={{ color: colors.text.primary }}
                >
                  {category.name}
                </span>
                <span
                  className="text-sm px-2 py-1 rounded"
                  style={{
                    color: colors.interactive.primary,
                    backgroundColor: colors.background.accent,
                  }}
                >
                  {category.products} products
                </span>
              </div>
            ))}
            {stats.topCategories.length === 0 && (
              <p style={{ color: colors.text.secondary }}>No categories yet</p>
            )}
          </div>
        </div>

        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text.primary }}
          >
            Top Companies
          </h3>
          <div className="space-y-3">
            {stats.topCompanies.slice(0, 5).map((company, index) => (
              <div key={index} className="flex items-center justify-between">
                <span
                  className="font-medium"
                  style={{ color: colors.text.primary }}
                >
                  {company.name}
                </span>
                <span
                  className="text-sm px-2 py-1 rounded"
                  style={{
                    color: colors.interactive.primary,
                    backgroundColor: colors.background.accent,
                  }}
                >
                  {company.products} products
                </span>
              </div>
            ))}
            {stats.topCompanies.length === 0 && (
              <p style={{ color: colors.text.secondary }}>No companies yet</p>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
