import axios from "axios";

export interface BillingAddress {
  _id: string;
  userId: string;
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get user's saved billing addresses
export const getBillingAddresses = async (): Promise<BillingAddress[]> => {
  try {
    const response = await api.get("/billing-addresses");
    return response.data.data;
  } catch (error: any) {
    console.error("Get billing addresses error:", error);
    throw error;
  }
};

// Save new billing address
export const saveBillingAddress = async (data: {
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
}): Promise<BillingAddress> => {
  try {
    const response = await api.post("/billing-addresses", data);
    return response.data.data;
  } catch (error: any) {
    console.error("Save billing address error:", error);
    throw error;
  }
};

// Delete a billing address
export const deleteBillingAddress = async (addressId: string): Promise<void> => {
  try {
    await api.delete(`/billing-addresses/${addressId}`);
  } catch (error: any) {
    console.error("Delete billing address error:", error);
    throw error;
  }
};
