import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create PhonePe payment order
export const createPhonePeOrder = async (orderId: string, amount: number, callbackUrl: string) => {
  const response = await api.post("/payments/phonepe/order", { orderId, amount, callbackUrl });
  return response.data;
};

// Verify PhonePe payment
export const verifyPhonePePayment = async (paymentId: string) => {
  const response = await api.post("/payments/phonepe/verify", { paymentId });
  return response.data;
};
