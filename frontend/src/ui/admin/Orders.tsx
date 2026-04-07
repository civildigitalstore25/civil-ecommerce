import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import AdminPagination from "./components/AdminPagination";
import { useAdminOrdersPage } from "./orders/useAdminOrdersPage";
import { useAdminOrderCreateForm } from "./orders/useAdminOrderCreateForm";
import OrdersLoading from "./orders/OrdersLoading";
import OrdersPageToolbar from "./orders/OrdersPageToolbar";
import OrdersSearchPanel from "./orders/OrdersSearchPanel";
import OrdersBulkStickyBar from "./orders/OrdersBulkStickyBar";
import AdminCreateOrderModal from "./orders/AdminCreateOrderModal";
import OrdersStatsGrid from "./orders/OrdersStatsGrid";
import OrdersDataTable from "./orders/OrdersDataTable";
import OrderDetailsModal from "./orders/OrderDetailsModal";

const Orders: React.FC = () => {
  const { colors, theme } = useAdminTheme();
  const createForm = useAdminOrderCreateForm();
  const page = useAdminOrdersPage();

  if (page.isLoading) {
    return <OrdersLoading colors={colors} />;
  }

  return (
    <div className="space-y-6">
      <OrdersPageToolbar
        colors={colors}
        showCreateForm={createForm.showCreateForm}
        onToggleCreate={() => createForm.setShowCreateForm((v) => !v)}
        statusFilter={page.statusFilter}
        onStatusFilterChange={page.setStatusFilter}
        exportOpen={page.exportOpen}
        setExportOpen={page.setExportOpen}
        exportRangeType={page.exportRangeType}
        setExportRangeType={page.setExportRangeType}
        exportDate={page.exportDate}
        setExportDate={page.setExportDate}
        exportWeek={page.exportWeek}
        setExportWeek={page.setExportWeek}
        exportMonth={page.exportMonth}
        setExportMonth={page.setExportMonth}
        exportYear={page.exportYear}
        setExportYear={page.setExportYear}
        exportCustomFromDate={page.exportCustomFromDate}
        setExportCustomFromDate={page.setExportCustomFromDate}
        exportCustomToDate={page.exportCustomToDate}
        setExportCustomToDate={page.setExportCustomToDate}
        onExportExcel={page.handleExportExcel}
        onExportJSON={page.handleExportJSON}
      />

      <OrdersSearchPanel
        colors={colors}
        searchTerm={page.searchTerm}
        onSearchChange={page.setSearchTerm}
      />

      <OrdersBulkStickyBar
        colors={colors}
        selectedCount={page.selectedOrders.length}
        bulkStatusDropdown={page.bulkStatusDropdown}
        onBulkStatusChange={page.setBulkStatusDropdown}
        onApplyBulk={() => page.handleBulkStatusUpdate(page.bulkStatusDropdown)}
        onClear={() => {
          page.setSelectedOrders([]);
          page.setBulkStatusDropdown("");
        }}
        bulkPending={page.bulkUpdateMutation.isPending}
      />

      {createForm.showCreateForm && (
        <AdminCreateOrderModal colors={colors} theme={theme} form={createForm} />
      )}

      <OrdersStatsGrid
        colors={colors}
        totalOrdersCount={page.totalOrdersCount}
        pendingCount={page.pendingOrders.length}
        processingCount={page.processingOrders.length}
        completedCount={page.completedOrders.length}
        cancelledCount={page.cancelledOrders.length}
      />

      <OrdersDataTable
        colors={colors}
        filteredOrders={page.filteredOrders}
        paginatedOrders={page.paginatedOrders}
        selectedOrders={page.selectedOrders}
        onSelectAll={page.handleSelectAll}
        onSelectOrder={page.handleSelectOrder}
        onViewDetails={page.handleViewDetails}
        onDeleteOrder={page.handleDeleteOrder}
        deletePending={page.deleteOrderMutation.isPending}
      />

      {!page.isLoading && page.filteredOrders.length > 0 && (
        <AdminPagination
          currentPage={page.currentPage}
          totalPages={page.totalPages}
          onPageChange={page.setCurrentPage}
          pageSize={page.pageSize}
          onPageSizeChange={page.setPageSize}
        />
      )}

      {page.showDetailsModal && page.selectedOrder && (
        <OrderDetailsModal
          colors={colors}
          order={page.selectedOrder}
          onClose={page.handleCloseModal}
        />
      )}
    </div>
  );
};

export default Orders;
