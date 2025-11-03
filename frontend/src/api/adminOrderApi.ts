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

  const response = await api.put(`/payments/admin/orders/${orderId}/status`, {
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
  const response = await api.delete(`/payments/admin/orders/${orderId}`);
  console.log("🗑️ Delete Response:", response.data);
  return response.data;
};

export default api;
