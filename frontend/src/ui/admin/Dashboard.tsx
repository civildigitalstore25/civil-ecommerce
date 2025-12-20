import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { TrendingUp, Users, Package2, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useProducts } from "../../api/productApi";
import { getAllOrders } from "../../api/adminOrderApi";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Dashboard: React.FC = () => {
  const { colors } = useAdminTheme();

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

  // Calculate statistics and sales data for charts
  const { stats, monthlySales, yearlySales } = useMemo(() => {
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

    // Monthly sales (current year)
    const now = new Date();
    const year = now.getFullYear();
    const monthlySales = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i).toLocaleString("default", { month: "short" }),
      sales: 0,
    }));
    orders.forEach((order: any) => {
      if (order.paymentStatus === "paid") {
        const d = new Date(order.createdAt);
        if (d.getFullYear() === year) {
          monthlySales[d.getMonth()].sales += order.totalAmount;
        }
      }
    });

    // Yearly sales (last 5 years)
    const yearMap: Record<number, number> = {};
    orders.forEach((order: any) => {
      if (order.paymentStatus === "paid") {
        const d = new Date(order.createdAt);
        const y = d.getFullYear();
        yearMap[y] = (yearMap[y] || 0) + order.totalAmount;
      }
    });
    const years = Object.keys(yearMap)
      .map(Number)
      .sort((a, b) => a - b)
      .slice(-5);
    const yearlySales = years.map((y) => ({ year: y, sales: yearMap[y] }));

    return {
      stats: {
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
      },
      monthlySales,
      yearlySales,
    };
  }, [productsData, ordersData, usersData]);
      {/* Sales Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 shadow-sm border transition-colors duration-200" style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.primary }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Monthly Sales (Current Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={colors.text.secondary} />
              <YAxis stroke={colors.text.secondary} tickFormatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Tooltip formatter={(value?: number) => value !== undefined ? `₹${value.toLocaleString("en-IN")}` : ''} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke={colors.interactive.primary} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-6 shadow-sm border transition-colors duration-200" style={{ backgroundColor: colors.background.secondary, borderColor: colors.border.primary }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>Yearly Sales (Last 5 Years)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlySales} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" stroke={colors.text.secondary} />
              <YAxis stroke={colors.text.secondary} tickFormatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
              <Tooltip formatter={(value?: number) => value !== undefined ? `₹${value.toLocaleString("en-IN")}` : ''} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke={colors.status.success} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default Dashboard;
