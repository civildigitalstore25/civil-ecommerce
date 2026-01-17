import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "./types/productTypes";
import { getAuth } from "../utils/auth";

// Use Vite's import.meta.env instead of process.env
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${apiBaseUrl}/api/products`,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const auth = getAuth();
  console.log("API Request config:", {
    url: config.url,
    method: config.method,
    hasAuth: !!auth?.token,
    role: auth?.role,
  });
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
    console.log("Added Authorization header");
  } else {
    console.log("No auth token found");
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    return Promise.reject(error);
  },
);

export const useProducts = (params?: {
  search?: string;
  category?: string;
  company?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    total: number;
  }>({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await apiClient.get("/", { params });
      return data;
    },
  });
};

// If id is provided, fetch single product. If not, fetch all products (for slug-based lookup)
export const useProductDetail = (id?: string) => {
  return useQuery<any>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (id) {
        const { data } = await apiClient.get(`/${id}`);
        return data;
      } else {
        // Fetch all products for slug-based lookup with high limit
        const { data } = await apiClient.get(`/`, { params: { limit: 1000 } });
        return Array.isArray(data.products) ? data.products : data;
      }
    },
  });
};

export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/filters/categories");
      return data;
    },
  });
};

export const useCompanies = () => {
  return useQuery<string[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await apiClient.get("/filters/companies");
      return data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Product) => {
      console.log("Creating product:", newProduct);
      const { data } = await apiClient.post("/", newProduct);
      console.log("Product created successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("Create product mutation success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("Create product error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updatedProduct,
    }: {
      id: string;
      updatedProduct: Product;
    }) => {
      console.log("🔍 API - Updating product with ID:", id);
      console.log("🔍 API - driveLink in payload:", updatedProduct.driveLink || 'NOT PROVIDED');
      console.log("🔍 API - Full product payload:", JSON.stringify(updatedProduct, null, 2));

      const { data } = await apiClient.put(`/${id}`, updatedProduct);

      console.log("✅ API - Product updated, response:", data);
      console.log("✅ API - driveLink in response:", data.driveLink || 'NOT IN RESPONSE');

      return data;
    },
    onSuccess: () => {
      console.log("Update product mutation success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("Update product error:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
