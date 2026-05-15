import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ExpiredProduct {
  _id: string;
  orderId: string;
  orderNumber: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  purchaseDate: string;
  licenseType: string;
  licenseExpiryDate: string;
  expiryDateDisplay: string;
  daysSinceExpiry: number;
  itemIndex: number;
  amount: number;
}

export interface ExpiryResponse {
  success: boolean;
  data: ExpiredProduct[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface ExpiryStatsResponse {
  success: boolean;
  stats: {
    expiredCount: number;
    expiringIn7Days: number;
    expiringIn30Days: number;
  };
}

/**
 * Fetch expired products/licenses
 */
export const getExpiredProducts = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ExpiryResponse> => {
  const response = await api.get("/expiry/expired", { params });
  return response.data;
};

/**
 * Fetch expiring products/licenses (within X days)
 */
export const getExpiringProducts = async (params?: {
  daysUntil?: number;
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<ExpiryResponse> => {
  const response = await api.get("/expiry/expiring", { params });
  return response.data;
};

/**
 * Get expiry statistics
 */
export const getExpiryStats = async (): Promise<ExpiryStatsResponse> => {
  const response = await api.get("/expiry/stats");
  return response.data;
};
