import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export interface SalesDataPoint {
  period: string;
  revenue: number;
  orderCount: number;
  date: string;
}

export interface AnalyticsData {
  salesData: SalesDataPoint[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

export type PeriodType = "weekly" | "monthly" | "yearly";

/**
 * Fetch sales analytics data from the backend
 * @param period - Time period for aggregation: 'weekly', 'monthly', or 'yearly'
 * @returns Sales analytics data
 */
export const getSalesAnalytics = async (
  period: PeriodType = "monthly"
): Promise<AnalyticsData> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get<AnalyticsResponse>(
      `${API_BASE_URL}/api/analytics/sales`,
      {
        params: { period },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch analytics data");
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Analytics API error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to fetch analytics data"
      );
    }
    throw error;
  }
};

/**
 * Download sales analytics as Excel file
 * @param period - Time period for aggregation
 */
export const downloadSalesExcel = async (
  period: PeriodType = "monthly"
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/analytics/sales/download/excel`,
      {
        params: { period },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales-analytics-${period}-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Download Excel error:", error.response?.data);
      throw new Error("Failed to download Excel file");
    }
    throw error;
  }
};

/**
 * Download sales analytics as PDF file
 * @param period - Time period for aggregation
 */
export const downloadSalesPDF = async (
  period: PeriodType = "monthly"
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/analytics/sales/download/pdf`,
      {
        params: { period },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales-analytics-${period}-${new Date().toISOString().split("T")[0]}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Download PDF error:", error.response?.data);
      throw new Error("Failed to download PDF file");
    }
    throw error;
  }
};
