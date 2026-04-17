import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/productTypes";
import { productApiClient } from "./productApiClient";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Product) => {
      const { data } = await productApiClient.post("/", newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
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
      const { data } = await productApiClient.put(
        `/${encodeURIComponent(id)}`,
        updatedProduct,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await productApiClient.delete(`/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
