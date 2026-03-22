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

export interface AdminOrdersResponse {
  success: boolean;
  data: {
    orders: any[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalOrders: number;
    };
  };
  message?: string;
}

/**
 * Create order (Admin only)
 */
export const adminCreateOrder = async (orderData: any) => {
  console.log("🌐 AdminOrderAPI - adminCreateOrder called with:", orderData);
  console.log("🌐 Request URL:", "/payments/admin/orders");
  const response = await api.post("/payments/admin/orders", orderData);
  console.log("🌐 Create Order Response:", response.data);
  return response.data;
};

/**
 * Fetch all orders (Admin only)
 */
export const getAllOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}): Promise<AdminOrdersResponse> => {
  const response = await api.get("/payments/admin/orders", { params });
  return response.data;
};

/**
 * Update order status (Admin only)
 */
export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string,
) => {
  console.log("🌐 AdminOrderAPI - updateOrderStatus called with:", {
    orderId,
    orderStatus,
  });
  console.log("🌐 Request URL:", `/payments/admin/orders/${orderId}/status`);
  console.log("🌐 Request body:", { orderStatus });

  const id = encodeURIComponent(String(orderId));
  const response = await api.put(`/payments/admin/orders/${id}/status`, {
    orderStatus,
  });

  console.log("🌐 API Response:", response.data);
  return response.data;
};

/**
 * Delete order (Admin only)
 */
export const deleteAdminOrder = async (orderId: string) => {
  console.log("🗑️ AdminOrderAPI - deleteAdminOrder called with:", { orderId });
  const id = encodeURIComponent(String(orderId));
  const response = await api.delete(`/payments/admin/orders/${id}`);
  console.log("🗑️ Delete Response:", response.data);
  return response.data;
};

/**
 * Bulk update order statuses (Admin only)
 */
export const bulkUpdateOrderStatuses = async (updates: Array<{ orderId: string; status: string }>) => {
  console.log("📦 AdminOrderAPI - bulkUpdateOrderStatuses called with:", { 
    count: updates.length,
    updates 
  });
  const response = await api.put("/payments/admin/orders/bulk/status", { updates });
  console.log("📦 Bulk Update Response:", response.data);
  return response.data;
};

/**
 * Export orders data for download
 */
export const exportOrders = async (format: "excel" | "json" = "excel", params?: {
  status?: string;
  paymentStatus?: string;
}) => {
  console.log("📊 AdminOrderAPI - exportOrders called with:", { format, params });
  const response = await api.get("/payments/admin/orders/export", {
    params: {
      format,
      ...params
    },
    responseType: format === "json" ? "json" : "arraybuffer"
  });
  return response.data;
};

export default api;
