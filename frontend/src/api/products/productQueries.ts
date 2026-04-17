import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types/productTypes";
import { productApiClient } from "./productApiClient";

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
      const { data } = await productApiClient.get("/", { params });
      return data;
    },
  });
};

/** If `id` is set, fetches one product; otherwise loads a large list for slug lookup. */
export const useProductDetail = (id?: string) => {
  return useQuery<any>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (id) {
        const { data } = await productApiClient.get(`/${id}`);
        return data;
      }
      const { data } = await productApiClient.get(`/`, {
        params: { limit: 1000 },
      });
      return Array.isArray(data.products) ? data.products : data;
    },
  });
};

export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await productApiClient.get("/filters/categories");
      return data;
    },
  });
};

export const useCompanies = () => {
  return useQuery<string[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data } = await productApiClient.get("/filters/companies");
      return data;
    },
  });
};

export const getBestSellingProducts = async (
  limit = 10,
): Promise<{ products: (Product & { soldCount?: number })[] }> => {
  const { data } = await productApiClient.get("/filter/best-selling", {
    params: { limit },
  });
  return data;
};

export const useBestSellingProducts = (limit = 10) => {
  return useQuery<{ products: (Product & { soldCount?: number })[] }>({
    queryKey: ["products", "best-selling", limit],
    queryFn: () => getBestSellingProducts(limit),
  });
};
