import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useProducts } from "../../../api/productApi";
import { getAllOrders } from "../../../api/adminOrderApi";
import {
  getSalesAnalytics,
  downloadSalesExcel,
  downloadSalesPDF,
  type PeriodType,
} from "../../../api/analyticsApi";
import { buildDashboardComparisonData } from "./buildDashboardComparisonData";
import { buildDashboardStats } from "./buildDashboardStats";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useAdminDashboard() {
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const [downloading, setDownloading] = useState<"excel" | "pdf" | null>(null);

  const { data: productsData } = useProducts({ limit: 1000 });

  const { data: ordersData } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => getAllOrders({ limit: 1000 }),
    refetchInterval: 30000,
  });

  const { data: usersData } = useQuery({
    queryKey: ["usersCount"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    refetchInterval: 60000,
  });

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["salesAnalytics", period],
    queryFn: () => getSalesAnalytics(period),
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
  });

  const comparisonData = useMemo(
    () => buildDashboardComparisonData(analyticsData),
    [analyticsData],
  );

  const stats = useMemo(
    () => buildDashboardStats(productsData, ordersData, usersData),
    [productsData, ordersData, usersData],
  );

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

  return {
    period,
    setPeriod,
    downloading,
    handleDownload,
    stats,
    comparisonData,
    analyticsData,
    analyticsLoading,
    analyticsError,
  };
}
