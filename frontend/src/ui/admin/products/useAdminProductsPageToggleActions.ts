import { useCallback } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Product } from "../../../api/types/productTypes";
import { axiosErrorMessage } from "../../../utils/axiosErrorMessage";
import { swalError, swalSuccessBrief } from "../../../utils/swal";
import { adminProductPageId } from "./adminProductPageUtils";

type UpdateVars = { id: string; updatedProduct: Product };
type UpdateMutation = Pick<
  UseMutationResult<unknown, unknown, UpdateVars>,
  "mutate"
>;

export function useAdminProductsPageToggleActions(args: {
  updateProductMutation: UpdateMutation;
}) {
  const { updateProductMutation } = args;

  const handleToggleBestSeller = useCallback(
    (product: Product) => {
      const pid = adminProductPageId(product);
      if (!pid) return;
      const updatedProduct = {
        ...product,
        isBestSeller: !product.isBestSeller,
      };
      updateProductMutation.mutate(
        {
          id: String(pid),
          updatedProduct: updatedProduct,
        },
        {
          onSuccess: () => {
            void swalSuccessBrief(
              "Success!",
              `Product ${updatedProduct.isBestSeller ? "marked as" : "removed from"} best seller`,
              1500,
            );
          },
          onError: (err: unknown) => {
            void swalError(
              axiosErrorMessage(err, "Failed to update best seller status"),
              "Error!",
            );
          },
        },
      );
    },
    [updateProductMutation],
  );

  const handleToggleOutOfStock = useCallback(
    (product: Product) => {
      const pid = adminProductPageId(product);
      if (!pid) return;
      const updatedProduct = {
        ...product,
        isOutOfStock: !product.isOutOfStock,
      };
      updateProductMutation.mutate(
        {
          id: String(pid),
          updatedProduct: updatedProduct,
        },
        {
          onSuccess: () => {
            void swalSuccessBrief(
              "Success!",
              `Product marked as ${updatedProduct.isOutOfStock ? "out of stock" : "in stock"}`,
              1500,
            );
          },
          onError: (err: unknown) => {
            void swalError(
              axiosErrorMessage(err, "Failed to update out of stock status"),
              "Error!",
            );
          },
        },
      );
    },
    [updateProductMutation],
  );

  return { handleToggleBestSeller, handleToggleOutOfStock };
}
