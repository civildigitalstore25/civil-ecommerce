import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Product } from "../../../api/types/productTypes";
import { swalConfirmDestructive, swalSuccessBrief } from "../../../utils/swal";

type DeleteMutation = Pick<UseMutationResult<unknown, unknown, string>, "mutate">;

export function useAdminProductsPageSelectionActions(args: {
  products: Product[];
  selectedProducts: string[];
  setSelectedProducts: Dispatch<SetStateAction<string[]>>;
  deleteProductMutation: DeleteMutation;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  setSelectedCompany: Dispatch<SetStateAction<string>>;
  setSelectedStatus: Dispatch<SetStateAction<string>>;
  setShowBestSellers: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    products,
    selectedProducts,
    setSelectedProducts,
    deleteProductMutation,
    setSearchTerm,
    setSelectedCategory,
    setSelectedCompany,
    setSelectedStatus,
    setShowBestSellers,
  } = args;

  const handleSelectAll = useCallback(() => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id!).filter(Boolean));
    }
  }, [selectedProducts.length, products, setSelectedProducts]);

  const handleSelectProduct = useCallback(
    (id: string) => {
      setSelectedProducts((prev) =>
        prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
      );
    },
    [setSelectedProducts],
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = [...selectedProducts];
    if (ids.length === 0) return;
    const count = ids.length;
    const ok = await swalConfirmDestructive({
      title: "Are you sure?",
      text: `You are about to delete ${count} product(s). This action cannot be undone.`,
      confirmButtonText: "Yes, delete them!",
    });
    if (!ok) return;
    ids.forEach((id) => {
      deleteProductMutation.mutate(id);
    });
    setSelectedProducts([]);
    void swalSuccessBrief(
      "Deleted!",
      `${count} product(s) have been deleted.`,
      2000,
    );
  }, [selectedProducts, deleteProductMutation, setSelectedProducts]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedCompany("All Brands");
    setSelectedStatus("All Status");
    setShowBestSellers(false);
  }, [
    setSearchTerm,
    setSelectedCategory,
    setSelectedCompany,
    setSelectedStatus,
    setShowBestSellers,
  ]);

  return {
    handleSelectAll,
    handleSelectProduct,
    handleBulkDelete,
    clearFilters,
  };
}
