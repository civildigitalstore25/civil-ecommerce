import axios from "axios";
import { getAuth } from "../../utils/auth";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const productApiClient = axios.create({
  baseURL: `${apiBaseUrl}/api/products`,
});

productApiClient.interceptors.request.use((config) => {
  const auth = getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

productApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "Products API error:",
      error.response?.status,
      error.config?.url,
    );
    return Promise.reject(error);
  },
);
