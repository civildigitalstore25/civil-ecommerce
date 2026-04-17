import { useEffect, useMemo, useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../../api/productApi";
import type { Product } from "../../../../api/types/productTypes";
import Swal from "sweetalert2";
import { filterDraftProductsList } from "./filterDraftProductsList";

export function useDraftProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showBestSellers, setShowBestSellers] = useState(false);

  const { data: productsData, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showBestSellers, pageSize]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    const result = await Swal.fire({
      title: "Delete Draft Product?",
      text: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
    });

    if (!result.isConfirmed) return;

    deleteProduct.mutate(product._id!, {
      onSuccess: () => {
        Swal.fire({
          title: "Deleted!",
          text: "Draft product has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: () => {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete the draft product.",
          icon: "error",
        });
      },
    });
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const rawProducts = productsData?.products || [];

  const allFilteredProducts = useMemo(
    () => filterDraftProductsList(rawProducts, searchTerm, debouncedSearch),
    [rawProducts, searchTerm, debouncedSearch],
  );

  const totalPages = Math.ceil(allFilteredProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const products = allFilteredProducts.slice(startIndex, startIndex + pageSize);

  const handleSaveProduct = (productData: Product) => {
    console.log(
      "💾 Frontend - Saving draft product with driveLink:",
      (productData as { driveLink?: string }).driveLink || "NOT PROVIDED",
    );

    const editingId =
      editingProduct?._id ?? (editingProduct as { id?: string })?.id;
    if (editingProduct && editingId) {
      updateProduct.mutate(
        { id: String(editingId), updatedProduct: productData },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            Swal.fire({
              title: "Success!",
              text:
                productData.status === "active"
                  ? "Draft product has been published to Products!"
                  : "Draft product updated successfully!",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          },
          onError: (error: unknown) => {
            console.error("❌ Update failed:", error);
            const err = error as {
              response?: { data?: { message?: string } };
              message?: string;
            };
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to save draft product. Please check all required fields.";
            Swal.fire({
              title: "Error!",
              text: errorMessage,
              icon: "error",
            });
          },
        },
      );
    } else {
      createProduct.mutate(productData, {
        onSuccess: () => {
          setIsModalOpen(false);
          Swal.fire({
            title: "Success!",
            text: "Draft product created successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: (error: unknown) => {
          console.error("❌ Create failed:", error);
          const err = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          const errorMessage =
            err?.response?.data?.message ||
            err?.message ||
            "Failed to create draft product. Please check all required fields.";
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
        },
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setShowBestSellers(false);
    setCurrentPage(1);
  };

  const totalDrafts = allFilteredProducts.length;

  return {
    isModalOpen,
    setIsModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    editingProduct,
    viewingProduct,
    searchTerm,
    setSearchTerm,
    showBestSellers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    isLoading,
    products,
    totalPages,
    totalDrafts,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleViewProduct,
    handleSaveProduct,
    handleClearFilters,
  };
}
