import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import AddProductModal from "./AddProductModal";
import ProductViewModal from "./ProductViewModal";
import { useDraftProductsPage } from "./draftProducts/useDraftProductsPage";
import { DraftProductsStatsCard } from "./draftProducts/DraftProductsStatsCard";
import { DraftProductsPageHeader } from "./draftProducts/DraftProductsPageHeader";
import { DraftProductsFiltersBar } from "./draftProducts/DraftProductsFiltersBar";
import { DraftProductsTable } from "./draftProducts/DraftProductsTable";

const DraftProducts: React.FC = () => {
  const { colors } = useAdminTheme();
  const page = useDraftProductsPage();

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
      }}
    >
      <div className="p-6 space-y-6">
        <DraftProductsStatsCard colors={colors} totalDrafts={page.totalDrafts} />
        <DraftProductsPageHeader
          colors={colors}
          onAddDraft={page.handleAddProduct}
        />
        <DraftProductsFiltersBar
          colors={colors}
          searchTerm={page.searchTerm}
          onSearchChange={page.setSearchTerm}
          showBestSellers={page.showBestSellers}
          onClearFilters={page.handleClearFilters}
        />
        <DraftProductsTable
          colors={colors}
          isLoading={page.isLoading}
          products={page.products}
          currentPage={page.currentPage}
          totalPages={page.totalPages}
          pageSize={page.pageSize}
          onPageChange={page.setCurrentPage}
          onPageSizeChange={page.setPageSize}
          onView={page.handleViewProduct}
          onEdit={page.handleEditProduct}
          onDelete={page.handleDeleteProduct}
        />
      </div>

      {page.isModalOpen && (
        <AddProductModal
          open={page.isModalOpen}
          onClose={() => page.setIsModalOpen(false)}
          onSave={page.handleSaveProduct}
          product={page.editingProduct}
        />
      )}

      {page.isViewModalOpen && page.viewingProduct && (
        <ProductViewModal
          isOpen={page.isViewModalOpen}
          onClose={() => page.setIsViewModalOpen(false)}
          product={page.viewingProduct}
        />
      )}
    </div>
  );
};

export default DraftProducts;
