import axios from "axios";
import type { OrderResponse, OrderDetailResponse } from "./types/orderTypes";

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

/**
 * Fetch all orders for the authenticated user
 */
export const getUserOrders = async (): Promise<OrderResponse> => {
  try {
    console.log("🔍 Fetching orders...");
    console.log(
      "Token:",
      localStorage.getItem("token") ? "Present" : "Missing",
    );
    const response = await api.get("/payments/orders");
    console.log("📦 Orders response:", response.data);
    console.log("📦 Orders count:", response.data?.data?.length || 0);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error fetching orders:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch details of a specific order
 */
export const getOrderDetails = async (
  orderId: string,
): Promise<OrderDetailResponse> => {
  const response = await api.get(`/payments/orders/${orderId}`);
  return response.data;
};

/**
 * Delete an order
 */
export const deleteOrder = async (orderId: string) => {
  const response = await api.delete(`/payments/orders/${orderId}`);
  return response.data;
};

/**
 * Initiate refund for an order
 */
export const initiateRefund = async (orderId: string) => {
  const response = await api.post(`/payments/refund/${orderId}`);
  return response.data;
};
