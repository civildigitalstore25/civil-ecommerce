import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrders,
  deleteAdminOrder,
  bulkUpdateOrderStatuses,
} from "../../../api/adminOrderApi";
import {
  filterOrdersBySearch,
  getOrderId,
  getStatusLabel,
  normOrderStatus,
  type AdminOrderLike,
} from "./adminOrderUtils";
import { useAdminOrdersExport } from "./useAdminOrdersExport";
import { swalError, swalFire, swalSuccessBrief, swalWarning } from "../../../utils/swal";
import { axiosErrorMessage } from "../../../utils/axiosErrorMessage";

export function useAdminOrdersPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderLike | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatusDropdown, setBulkStatusDropdown] = useState("");

  const exportApi = useAdminOrdersExport({ statusFilter, searchTerm });

  const { data, isLoading } = useQuery({
    queryKey: ["adminOrders", statusFilter],
    queryFn: () =>
      getAllOrders({
        status: statusFilter ? statusFilter.toLowerCase() : undefined,
        limit: 100,
      }),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => deleteAdminOrder(orderId),
    onSuccess: () => {
      void swalSuccessBrief("Deleted!", "Order has been deleted successfully", 2000);
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.refetchQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: unknown) => {
      void swalError(axiosErrorMessage(error, "Failed to delete order"), "Error");
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: (updates: Array<{ orderId: string; status: string }>) =>
      bulkUpdateOrderStatuses(updates),
    onSuccess: (res: unknown) => {
      const payload = res as { data?: { successCount?: number; failureCount?: number } };
      const successCount = payload?.data?.successCount ?? 0;
      const failureCount = payload?.data?.failureCount ?? 0;
      void swalSuccessBrief(
        "Success",
        `${successCount} orders updated successfully${failureCount > 0 ? `, ${failureCount} failed` : ""}`,
        2000,
      );
      setSelectedOrders([]);
      setBulkStatusDropdown("");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.refetchQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: unknown) => {
      void swalError(axiosErrorMessage(error, "Failed to update orders"), "Error");
    },
  });

  const orders = (data?.data?.orders || []) as AdminOrderLike[];
  const filteredOrders = filterOrdersBySearch(orders, searchTerm);
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const handleSelectAll = () => {
    if (selectedOrders.length === paginatedOrders.length) setSelectedOrders([]);
    else setSelectedOrders(paginatedOrders.map((o) => getOrderId(o)));
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    );
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    if (selectedOrders.length === 0) {
      void swalWarning("Warning", "Please select at least one order");
      return;
    }
    const normalizedStatus = newStatus === "success" ? "delivered" : newStatus;
    const updates = selectedOrders.map((orderId) => ({
      orderId,
      status: normalizedStatus,
    }));

    void swalFire({
      title: "Update Status?",
      text: `Update ${selectedOrders.length} selected order(s) to ${getStatusLabel(normalizedStatus)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) bulkUpdateMutation.mutate(updates);
    });
  };

  const totalOrdersCount = filteredOrders.length;
  const pendingOrders = filteredOrders.filter((o) => normOrderStatus(o.orderStatus) === "pending");
  const processingOrders = filteredOrders.filter(
    (o) => normOrderStatus(o.orderStatus) === "processing",
  );
  const completedOrders = filteredOrders.filter(
    (o) => normOrderStatus(o.orderStatus) === "delivered",
  );
  const cancelledOrders = filteredOrders.filter(
    (o) => normOrderStatus(o.orderStatus) === "cancelled",
  );

  const handleViewDetails = (order: AdminOrderLike) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (order: AdminOrderLike) => {
    void swalFire({
      title: "Delete Order?",
      html: `Are you sure you want to delete order <strong>#${order.orderNumber}</strong>?<br/><small>This action cannot be undone.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) deleteOrderMutation.mutate(getOrderId(order));
    });
  };

  return {
    isLoading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedOrders,
    bulkStatusDropdown,
    setBulkStatusDropdown,
    bulkUpdateMutation,
    deleteOrderMutation,
    selectedOrder,
    showDetailsModal,
    filteredOrders,
    paginatedOrders,
    totalPages,
    totalOrdersCount,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    handleSelectAll,
    handleSelectOrder,
    handleBulkStatusUpdate,
    handleViewDetails,
    handleCloseModal,
    handleDeleteOrder,
    getOrderId,
    normOrderStatus,
    getStatusLabel,
    setSelectedOrders,
    ...exportApi,
  };
}
