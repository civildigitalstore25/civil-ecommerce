import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import AdminPagination from "../components/AdminPagination";
import { useAdminExpiryPage } from "./useAdminExpiryPage";
import ExpiryLoading from "./ExpiryLoading";
import ExpiryPageToolbar from "./ExpiryPageToolbar";
import ExpirySearchPanel from "./ExpirySearchPanel";
import ExpiryStatsGrid from "./ExpiryStatsGrid";
import ExpiryDataTable from "./ExpiryDataTable";

const Expiry: React.FC = () => {
  const { colors } = useAdminTheme();
  const page = useAdminExpiryPage();

  if (page.isLoading) {
    return <ExpiryLoading colors={colors} />;
  }

  return (
    <div className="space-y-6">
      <ExpiryPageToolbar
        colors={colors}
        totalExpiredCount={page.totalCount}
      />

      <ExpirySearchPanel
        colors={colors}
        searchTerm={page.searchTerm}
        onSearchChange={page.setSearchTerm}
      />

      <ExpiryStatsGrid
        colors={colors}
        totalExpiredCount={page.totalCount}
        recentlyExpired={page.expiryDistribution.recentlyExpired}
        moderatelyExpired={page.expiryDistribution.moderatelyExpired}
        oldExpiry={page.expiryDistribution.oldExpiry}
        veryOldExpiry={page.expiryDistribution.veryOldExpiry}
      />

      <ExpiryDataTable
        colors={colors}
        expiredProducts={page.expiredProducts}
        paginatedProducts={page.expiredProducts}
        selectedProducts={page.selectedProducts}
        onSelectAll={page.handleSelectAll}
        onSelectProduct={page.handleSelectProduct}
      />

      {!page.isLoading && page.expiredProducts.length > 0 && (
        <AdminPagination
          currentPage={page.currentPage}
          totalPages={page.totalPages}
          onPageChange={page.setCurrentPage}
          pageSize={page.pageSize}
          onPageSizeChange={page.setPageSize}
        />
      )}
    </div>
  );
};

export default Expiry;
