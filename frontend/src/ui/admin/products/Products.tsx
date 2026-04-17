import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import AddProductModal from "./AddProductModal";
import ProductViewModal from "./ProductViewModal";
import AdminPagination from "../components/AdminPagination";
import ProductsPageStatsRow from "./ProductsPageStatsRow";
import ProductsPageToolbar from "./ProductsPageToolbar";
import ProductsPageTable from "./ProductsPageTable";
import { useAdminProductsPage } from "./useAdminProductsPage";

const Products: React.FC = () => {
  const { colors } = useAdminTheme();
  const p = useAdminProductsPage();

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <div className="p-6 space-y-6">
        <ProductsPageStatsRow
          colors={colors}
          totalProducts={p.totalProducts}
          activeProducts={p.activeProducts}
          draftProducts={p.draftProducts}
          inactiveProducts={p.inactiveProducts}
          exportOpen={p.exportOpen}
          setExportOpen={p.setExportOpen}
          onExportExcel={p.handleExportExcel}
          onExportJSON={p.handleExportJSON}
        />

        <ProductsPageToolbar
          colors={colors}
          searchTerm={p.searchTerm}
          setSearchTerm={p.setSearchTerm}
          selectedCategory={p.selectedCategory}
          setSelectedCategory={p.setSelectedCategory}
          selectedCompany={p.selectedCompany}
          setSelectedCompany={p.setSelectedCompany}
          selectedStatus={p.selectedStatus}
          setSelectedStatus={p.setSelectedStatus}
          showBestSellers={p.showBestSellers}
          setShowBestSellers={p.setShowBestSellers}
          categories={p.categories}
          companies={p.companies}
          clearFilters={p.clearFilters}
          selectedCount={p.selectedProducts.length}
          onBulkDelete={p.handleBulkDelete}
          onAddProduct={p.openCreateModal}
        />

        {p.isLoading && (
          <div
            className="text-center py-8"
            style={{ color: colors.text.primary }}
          >
            Loading products...
          </div>
        )}
        {p.error && (
          <div className="text-center py-8 text-red-400">
            Error loading products
          </div>
        )}

        {!p.isLoading && !p.error && (
          <ProductsPageTable
            colors={colors}
            products={p.products}
            selectedProducts={p.selectedProducts}
            onSelectAll={p.handleSelectAll}
            onSelectProduct={p.handleSelectProduct}
            onToggleBestSeller={p.handleToggleBestSeller}
            onToggleOutOfStock={p.handleToggleOutOfStock}
            onView={p.openViewModal}
            onEdit={p.handleEditProduct}
            onDelete={p.handleDeleteProduct}
          />
        )}

        {!p.isLoading && !p.error && (
          <AdminPagination
            currentPage={p.currentPage}
            totalPages={p.totalPages}
            onPageChange={p.setCurrentPage}
            pageSize={p.pageSize}
            onPageSizeChange={p.setPageSize}
          />
        )}

        <AddProductModal
          open={p.modalOpen}
          onClose={p.closeModal}
          onSave={p.handleSaveProduct}
          product={p.editingProduct}
        />

        <ProductViewModal
          product={p.viewingProduct}
          isOpen={p.isViewModalOpen}
          onClose={p.closeViewModal}
        />
      </div>
    </div>
  );
};

export default Products;
