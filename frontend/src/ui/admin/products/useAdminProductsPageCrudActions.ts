import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Product } from "../../../api/types/productTypes";
import { axiosErrorMessage } from "../../../utils/axiosErrorMessage";
import {
  swalConfirmDestructive,
  swalError,
  swalSuccessBrief,
} from "../../../utils/swal";
import { adminProductPageId } from "./adminProductPageUtils";
import { useAdminProductsPageToggleActions } from "./useAdminProductsPageToggleActions";

type UpdateVars = { id: string; updatedProduct: Product };
type UpdateMutation = Pick<
  UseMutationResult<unknown, unknown, UpdateVars>,
  "mutate"
>;
type CreateMutation = Pick<
  UseMutationResult<unknown, unknown, Product>,
  "mutate"
>;
type DeleteMutation = Pick<UseMutationResult<unknown, unknown, string>, "mutate">;

export function useAdminProductsPageCrudActions(args: {
  editingProduct: Product | null;
  setEditingProduct: Dispatch<SetStateAction<Product | null>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setViewingProduct: Dispatch<SetStateAction<Product | null>>;
  setIsViewModalOpen: Dispatch<SetStateAction<boolean>>;
  createProductMutation: CreateMutation;
  updateProductMutation: UpdateMutation;
  deleteProductMutation: DeleteMutation;
}) {
  const {
    editingProduct,
    setEditingProduct,
    setModalOpen,
    setViewingProduct,
    setIsViewModalOpen,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  } = args;

  const handleSaveProduct = useCallback(
    (productData: Product) => {
      const editingId = editingProduct
        ? adminProductPageId(editingProduct)
        : undefined;
      if (editingProduct && editingId) {
        updateProductMutation.mutate(
          {
            id: String(editingId),
            updatedProduct: productData,
          },
          {
            onSuccess: () => {
              void swalSuccessBrief(
                "Success!",
                "Product updated successfully",
                2000,
              );
              setModalOpen(false);
              setEditingProduct(null);
            },
            onError: (err: unknown) => {
              void swalError(
                axiosErrorMessage(err, "Failed to update product"),
                "Error!",
              );
            },
          },
        );
      } else {
        createProductMutation.mutate(productData, {
          onSuccess: () => {
            void swalSuccessBrief(
              "Success!",
              "Product created successfully",
              2000,
            );
            setModalOpen(false);
            setEditingProduct(null);
          },
          onError: (err: unknown) => {
            void swalError(
              axiosErrorMessage(err, "Failed to create product"),
              "Error!",
            );
          },
        });
      }
    },
    [
      editingProduct,
      updateProductMutation,
      createProductMutation,
      setModalOpen,
      setEditingProduct,
    ],
  );

  const handleEditProduct = useCallback(
    (product: Product) => {
      setEditingProduct(product);
      setModalOpen(true);
    },
    [setEditingProduct, setModalOpen],
  );

  const handleDeleteProduct = useCallback(
    async (id: string, productName: string) => {
      const ok = await swalConfirmDestructive({
        title: "Are you sure?",
        text: `You are about to delete "${productName}". This action cannot be undone.`,
        confirmButtonText: "Yes, delete it!",
      });
      if (!ok) return;
      deleteProductMutation.mutate(id);
      void swalSuccessBrief(
        "Deleted!",
        `"${productName}" has been deleted.`,
        2000,
      );
    },
    [deleteProductMutation],
  );

  const { handleToggleBestSeller, handleToggleOutOfStock } =
    useAdminProductsPageToggleActions({ updateProductMutation });

  const openCreateModal = useCallback(() => {
    setEditingProduct(null);
    setModalOpen(true);
  }, [setEditingProduct, setModalOpen]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingProduct(null);
  }, [setModalOpen, setEditingProduct]);

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingProduct(null);
  }, [setIsViewModalOpen, setViewingProduct]);

  const openViewModal = useCallback(
    (product: Product) => {
      setViewingProduct(product);
      setIsViewModalOpen(true);
    },
    [setViewingProduct, setIsViewModalOpen],
  );

  return {
    handleSaveProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleToggleBestSeller,
    handleToggleOutOfStock,
    openCreateModal,
    closeModal,
    closeViewModal,
    openViewModal,
  };
}
