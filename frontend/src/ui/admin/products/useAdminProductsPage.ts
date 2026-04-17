import { useState } from "react";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../../api/productApi";
import type { Product } from "../../../api/types/productTypes";
import { useAdminProductsExport } from "./useAdminProductsExport";
import { useAdminProductsPageCrudActions } from "./useAdminProductsPageCrudActions";
import { useAdminProductsPageList } from "./useAdminProductsPageList";
import { useAdminProductsPageSelectionActions } from "./useAdminProductsPageSelectionActions";

export function useAdminProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const list = useAdminProductsPageList();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const {
    exportOpen,
    setExportOpen,
    handleExportExcel,
    handleExportJSON,
  } = useAdminProductsExport(list.products);

  const {
    handleSelectAll,
    handleSelectProduct,
    handleBulkDelete,
    clearFilters,
  } = useAdminProductsPageSelectionActions({
    products: list.products,
    selectedProducts,
    setSelectedProducts,
    deleteProductMutation,
    setSearchTerm: list.setSearchTerm,
    setSelectedCategory: list.setSelectedCategory,
    setSelectedCompany: list.setSelectedCompany,
    setSelectedStatus: list.setSelectedStatus,
    setShowBestSellers: list.setShowBestSellers,
  });

  const {
    handleSaveProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleToggleBestSeller,
    handleToggleOutOfStock,
    openCreateModal,
    closeModal,
    closeViewModal,
    openViewModal,
  } = useAdminProductsPageCrudActions({
    editingProduct,
    setEditingProduct,
    setModalOpen,
    setViewingProduct,
    setIsViewModalOpen,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  });

  return {
    isLoading: list.isLoading,
    error: list.error,
    categories: list.categories,
    companies: list.companies,
    products: list.products,
    totalPages: list.totalPages,
    currentPage: list.currentPage,
    setCurrentPage: list.setCurrentPage,
    pageSize: list.pageSize,
    setPageSize: list.setPageSize,
    searchTerm: list.searchTerm,
    setSearchTerm: list.setSearchTerm,
    selectedCategory: list.selectedCategory,
    setSelectedCategory: list.setSelectedCategory,
    selectedCompany: list.selectedCompany,
    setSelectedCompany: list.setSelectedCompany,
    selectedStatus: list.selectedStatus,
    setSelectedStatus: list.setSelectedStatus,
    showBestSellers: list.showBestSellers,
    setShowBestSellers: list.setShowBestSellers,
    clearFilters,
    selectedProducts,
    handleSelectAll,
    handleSelectProduct,
    handleBulkDelete,
    handleSaveProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleToggleBestSeller,
    handleToggleOutOfStock,
    totalProducts: list.totalProducts,
    activeProducts: list.activeProducts,
    draftProducts: list.draftProducts,
    inactiveProducts: list.inactiveProducts,
    exportOpen,
    setExportOpen,
    handleExportExcel,
    handleExportJSON,
    modalOpen,
    closeModal,
    editingProduct,
    openCreateModal,
    viewingProduct,
    isViewModalOpen,
    openViewModal,
    closeViewModal,
  };
}
