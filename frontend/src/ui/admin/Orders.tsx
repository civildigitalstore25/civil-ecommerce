import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  Phone,
  Mail,
  User,
  Trash2,
  ShoppingCart,
  FileText,
  Plus,
} from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import {
  getAllOrders,
  updateOrderStatus,
  deleteAdminOrder,
  adminCreateOrder,
} from "../../api/adminOrderApi";
import FormButton from "../../components/Button/FormButton";
import AdminPagination from "./components/AdminPagination";
import Swal from "sweetalert2";

import type { IOrderItem } from "../../api/types/orderTypes";

const Orders: React.FC = () => {
  // State for admin order creation form (no dropdown, no address, no shipping)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [orderForm, setOrderForm] = useState<{
    email?: string;
    items: IOrderItem[];
    subtotal: number;
    discount?: number;
    totalAmount: number;
    notes?: string;
  }>({
    items: [],
    subtotal: 0,
    discount: undefined,
    totalAmount: 0,
  });

  // Add product to order items (by type input)
  const handleAddProductToOrder = (product: { productId: string; name: string; quantity: number; price: number; discount?: number }) => {
    setOrderForm((prev) => {
      const exists = prev.items.find((i) => i.productId === product.productId);
      if (exists) return prev;
      return {
        ...prev,
        items: [
          ...prev.items,
          product as IOrderItem,
        ],
      };
    });
  };

  // Remove product from order items
  const handleRemoveOrderItem = (productId: string) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  // Update quantity/price for order item
  const handleOrderItemChange = (productId: string, field: string, value: any) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, [field]: value } : i
      ),
    }));
  };

  // Calculate totals (no shipping)
  React.useEffect(() => {
    const subtotal = orderForm.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const totalAmount = subtotal - (orderForm.discount || 0);
    setOrderForm((prev) => ({ ...prev, subtotal, totalAmount }));
  }, [orderForm.items, orderForm.discount]);

  // Admin create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: any) => adminCreateOrder(data),
    onSuccess: () => {
      Swal.fire({ icon: "success", title: "Order Created", text: "Order created successfully!", timer: 2000, showConfirmButton: false });
      setShowCreateForm(false);
      setOrderForm({
        items: [],
        subtotal: 0,
        discount: 0,
        totalAmount: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: any) => {
      Swal.fire({ icon: "error", title: "Error", text: error?.response?.data?.message || "Failed to create order" });
    },
  });
  const { colors, theme } = useAdminTheme();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editedStatuses, setEditedStatuses] = useState<Record<string, string>>(
    {},
  );
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch all orders
  const { data, isLoading } = useQuery({
    queryKey: ["adminOrders", statusFilter],
    queryFn: () =>
      getAllOrders({ status: statusFilter || undefined, limit: 100 }),
  });



  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => {
      console.log("📡 Calling API with:", { orderId, status });
      return updateOrderStatus(orderId, status);
    },
    onSuccess: (data) => {
      console.log("✅ Update successful:", data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order status updated successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      // Invalidate all admin order queries
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      // Invalidate all user order queries (this will refresh My Orders page)
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      // Refetch immediately to ensure UI is up to date
      queryClient.refetchQueries({ queryKey: ["adminOrders"] });
      queryClient.refetchQueries({ queryKey: ["userOrders"] });
      // Clear the edited status after successful update
      setEditedStatuses({});
    },
    onError: (error: any) => {
      console.error("❌ Update failed:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.response?.data?.message);
      console.error("Error status:", error.response?.status);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update order status",
        footer: error.response?.status
          ? `Status Code: ${error.response.status}`
          : "",
      });
    },
  });

  // Delete order mutation (Admin only)
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => {
      console.log("🗑️ Deleting order:", orderId);
      return deleteAdminOrder(orderId);
    },
    onSuccess: (data) => {
      console.log("✅ Delete successful:", data);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Order has been deleted successfully",
        timer: 2000,
        showConfirmButton: false,
      });
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
      queryClient.refetchQueries({ queryKey: ["adminOrders"] });
    },
    onError: (error: any) => {
      console.error("❌ Delete failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete order",
      });
    },
  });

  // Helper to get the correct order ID (orderId for API, _id as fallback)
  const getOrderId = (order: any): string => {
    return order.orderId || order._id;
  };

  const orders = data?.data?.orders || [];

  // Filter orders by search term (name or email)
  const getFilteredOrders = () => {
    if (!searchTerm.trim()) return orders;

    const search = searchTerm.toLowerCase();
    return orders.filter((order: any) => {
      const userName = order.userId?.fullName?.toLowerCase() || "";
      const userEmail = order.userId?.email?.toLowerCase() || "";
      const shippingName = order.shippingAddress?.fullName?.toLowerCase() || "";
      return userName.includes(search) || userEmail.includes(search) || shippingName.includes(search);
    });
  };

  const filteredOrders = getFilteredOrders();

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  // Debug: Log first order to check structure
  if (orders.length > 0) {
    console.log("📦 First order structure:", orders[0]);
    console.log("📦 First order orderId:", orders[0].orderId);
    console.log("📦 First order _id:", orders[0]._id);
    console.log("📦 Using ID for updates:", getOrderId(orders[0]));
  }

  const completedOrders = filteredOrders.filter(
    (o: any) => o.orderStatus === "delivered",
  );
  const processingOrders = filteredOrders.filter(
    (o: any) => o.orderStatus === "processing",
  );
  const cancelledOrders = filteredOrders.filter(
    (o: any) => o.orderStatus === "cancelled",
  );

  const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === "delivered") return "Success";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleStatusSelect = (orderId: string, newStatus: string) => {
    setEditedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log("🔄 Attempting to update order:", { orderId, newStatus });

    if (!orderId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Order ID is missing. Cannot update status.",
      });
      console.error("❌ orderId is undefined or empty:", orderId);
      return;
    }

    Swal.fire({
      title: "Update Order Status?",
      text: `Are you sure you want to change the status to ${getStatusLabel(newStatus)}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✅ User confirmed, calling mutation...");
        updateStatusMutation.mutate({
          orderId,
          status: newStatus,
        });
      } else {
        console.log("❌ User cancelled update");
      }
    });
  };

  const handleViewDetails = (order: any) => {
    console.log('📋 Selected Order Full Data:', order);
    console.log('📦 Order Items:', order.items);
    if (order.items && order.items.length > 0) {
      console.log('🔍 First Item Details:', {
        name: order.items[0].name,
        version: order.items[0].version,
        pricingPlan: order.items[0].pricingPlan,
        fullItem: order.items[0]
      });
    }
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (order: any) => {
    Swal.fire({
      title: "Delete Order?",
      html: `Are you sure you want to delete order <strong>#${order.orderNumber}</strong>?<br/><small>This action cannot be undone.</small>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✅ Admin confirmed delete, calling mutation...");
        deleteOrderMutation.mutate(getOrderId(order));
      } else {
        console.log("❌ Admin cancelled delete");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.interactive.primary }}
          ></div>
          <p style={{ color: colors.text.secondary }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>Orders Management</h2>
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 rounded-lg font-medium"
            style={{ background: '#0068ff', color: '#fff' }}
            onClick={() => setShowCreateForm((v) => !v)}
          >
            {showCreateForm ? "Close" : "Create Order"}
          </button>
          <select
            className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="processing">Processing</option>
            <option value="delivered">Success</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Search by Name or Email */}
      <div
        className="rounded-lg p-4 border"
        style={{
          background: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
          Search by Customer Name or Email
        </label>
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          placeholder="Enter customer name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Admin Order Creation Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto create-order-panel"
            style={{ backgroundColor: colors.background.secondary }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .create-order-panel input::placeholder,
              .create-order-panel textarea::placeholder {
                color: ${theme === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(107,114,128,0.6)'} !important;
              }
              .create-order-panel input:focus,
              .create-order-panel textarea:focus,
              .create-order-panel select:focus {
                border-color: #0068ff !important;
                box-shadow: 0 0 0 3px rgba(0, 104, 255, 0.1) !important;
              }
              .create-order-panel .product-item-card {
                transition: all 0.2s ease;
              }
              .create-order-panel .product-item-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
            `}</style>

            {/* Modal Header */}
            <div 
              className="sticky top-0 z-10 p-6 border-b flex items-center justify-between"
              style={{ 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary 
              }}
            >
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <Package className="w-6 h-6" style={{ color: '#0068ff' }} />
                  Create New Order
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                  Fill in the details below to create a new order manually
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-all duration-200"
                style={{ backgroundColor: colors.background.accent }}
              >
                <X className="w-6 h-6" style={{ color: colors.text.primary }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Information Section */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary 
                }}
              >
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <User className="w-5 h-5" style={{ color: '#0068ff' }} />
                  Customer Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      Customer Email <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200"
                      type="email"
                      placeholder="customer@example.com"
                      value={orderForm.email || ""}
                      onChange={e => setOrderForm(f => ({ ...f, email: e.target.value }))}
                      style={{ 
                        color: colors.text.primary, 
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary 
                      }}
                    />
                    <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
                      Enter the customer's email address for order notifications
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items Section */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary 
                }}
              >
                <h4 className="font-semibold text-lg mb-4 flex items-center justify-between" style={{ color: colors.text.primary }}>
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" style={{ color: '#0068ff' }} />
                    Order Items ({orderForm.items.length})
                  </span>
                </h4>

                {/* Display Added Items */}
                {orderForm.items.length === 0 ? (
                  <div 
                    className="text-center py-8 rounded-lg border-2 border-dashed"
                    style={{ 
                      borderColor: colors.border.primary,
                      color: colors.text.secondary 
                    }}
                  >
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No products added yet. Add products below to continue.</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {orderForm.items.map((item) => (
                      <div 
                        key={item.productId} 
                        className="product-item-card p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary 
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>Product Name</label>
                              <input 
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                                placeholder="Product Name" 
                                value={item.name} 
                                onChange={e => handleOrderItemChange(item.productId, 'name', e.target.value)} 
                                style={{ 
                                  color: colors.text.primary, 
                                  backgroundColor: colors.background.primary,
                                  borderColor: colors.border.primary 
                                }} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>Quantity</label>
                              <input 
                                type="number" 
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                                min={1} 
                                value={item.quantity} 
                                onChange={e => handleOrderItemChange(item.productId, 'quantity', Number(e.target.value))} 
                                style={{ 
                                  color: colors.text.primary, 
                                  backgroundColor: colors.background.primary,
                                  borderColor: colors.border.primary 
                                }} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>Price (₹)</label>
                              <input 
                                type="number" 
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                                min={0} 
                                value={item.price} 
                                onChange={e => handleOrderItemChange(item.productId, 'price', Number(e.target.value))} 
                                style={{ 
                                  color: colors.text.primary, 
                                  backgroundColor: colors.background.primary,
                                  borderColor: colors.border.primary 
                                }} 
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1" style={{ color: colors.text.secondary }}>Discount (₹)</label>
                              <input 
                                type="number" 
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                                min={0} 
                                placeholder="0" 
                                value={item.discount === undefined ? '' : item.discount} 
                                onChange={e => handleOrderItemChange(item.productId, 'discount', e.target.value === '' ? undefined : Number(e.target.value))} 
                                style={{ 
                                  color: colors.text.primary, 
                                  backgroundColor: colors.background.primary,
                                  borderColor: colors.border.primary 
                                }} 
                              />
                            </div>
                          </div>
                          <button 
                            className="p-2 rounded-lg hover:bg-red-500 hover:bg-opacity-10 transition-all duration-200 mt-6"
                            onClick={() => handleRemoveOrderItem(item.productId)}
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
                          </button>
                        </div>
                        <div className="mt-2 text-xs flex items-center gap-2" style={{ color: colors.text.secondary }}>
                          <span>Total: ₹{(item.price * item.quantity - (item.discount || 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Product Form */}
                <div 
                  className="mt-4 p-5 rounded-xl border-2 border-dashed"
                  style={{ 
                    backgroundColor: colors.background.accent,
                    borderColor: '#0068ff' + '40' 
                  }}
                >
                  <h5 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: colors.text.primary }}>
                    <Plus className="w-4 h-4" style={{ color: '#0068ff' }} />
                    Add Product to Order
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
                        Product ID <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                        placeholder="e.g., PROD123" 
                        id="newProductId" 
                        style={{ 
                          color: colors.text.primary, 
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary 
                        }} 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
                        Product Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                        placeholder="e.g., Software License" 
                        id="newProductName" 
                        style={{ 
                          color: colors.text.primary, 
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary 
                        }} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
                        Quantity <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                        min={1} 
                        defaultValue={1} 
                        id="newProductQty" 
                        style={{ 
                          color: colors.text.primary, 
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary 
                        }} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>
                        Price (₹) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                        min={0} 
                        defaultValue={0} 
                        id="newProductPrice" 
                        style={{ 
                          color: colors.text.primary, 
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary 
                        }} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium block mb-1" style={{ color: colors.text.primary }}>Discount (₹)</label>
                      <input 
                        type="number" 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition" 
                        min={0} 
                        placeholder="Optional" 
                        id="newProductDiscount" 
                        style={{ 
                          color: colors.text.primary, 
                          backgroundColor: colors.background.primary,
                          borderColor: colors.border.primary 
                        }} 
                      />
                    </div>
                    <div className="md:col-span-4 flex items-end">
                      <button 
                        className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200" 
                        style={{ background: '#0068ff', color: '#fff' }} 
                        onClick={() => {
                          const productId = (document.getElementById("newProductId") as HTMLInputElement).value.trim();
                          const name = (document.getElementById("newProductName") as HTMLInputElement).value.trim();
                          const quantity = Number((document.getElementById("newProductQty") as HTMLInputElement).value);
                          const price = Number((document.getElementById("newProductPrice") as HTMLInputElement).value);
                          const discountValue = (document.getElementById("newProductDiscount") as HTMLInputElement).value;
                          const discount = discountValue === '' ? undefined : Number(discountValue);
                          
                          if (!productId || !name) {
                            Swal.fire({ icon: 'error', title: 'Required Fields', text: 'Please fill in Product ID and Product Name' });
                            return;
                          }
                          if (quantity <= 0) {
                            Swal.fire({ icon: 'error', title: 'Invalid Quantity', text: 'Quantity must be greater than 0' });
                            return;
                          }
                          
                          handleAddProductToOrder({ productId, name, quantity, price, discount });
                          (document.getElementById("newProductId") as HTMLInputElement).value = "";
                          (document.getElementById("newProductName") as HTMLInputElement).value = "";
                          (document.getElementById("newProductQty") as HTMLInputElement).value = "1";
                          (document.getElementById("newProductPrice") as HTMLInputElement).value = "0";
                          (document.getElementById("newProductDiscount") as HTMLInputElement).value = "";
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add to Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div 
                className="p-5 rounded-xl border"
                style={{ 
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary 
                }}
              >
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: colors.text.primary }}>
                  <FileText className="w-5 h-5" style={{ color: '#0068ff' }} />
                  Additional Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      Total Discount (₹)
                    </label>
                    <input 
                      type="number" 
                      className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200" 
                      min={0} 
                      placeholder="0" 
                      value={orderForm.discount || ""} 
                      onChange={e => setOrderForm(f => ({ ...f, discount: e.target.value === '' ? undefined : Number(e.target.value) }))} 
                      style={{ 
                        color: colors.text.primary, 
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary 
                      }} 
                    />
                    <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
                      Additional discount on the entire order
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      Order Notes
                    </label>
                    <textarea 
                      className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 resize-none" 
                      placeholder="Add any special notes or instructions..." 
                      rows={3} 
                      value={orderForm.notes || ""} 
                      onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} 
                      style={{ 
                        color: colors.text.primary, 
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary 
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div 
                className="p-5 rounded-xl border-2"
                style={{ 
                  backgroundColor: colors.background.accent,
                  borderColor: '#0068ff' + '40' 
                }}
              >
                <h4 className="font-semibold text-lg mb-4" style={{ color: colors.text.primary }}>
                  Order Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: colors.text.secondary }}>Subtotal:</span>
                    <span className="font-semibold text-lg" style={{ color: colors.text.primary }}>
                      ₹{orderForm.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {orderForm.discount && orderForm.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span style={{ color: colors.text.secondary }}>Discount:</span>
                      <span className="font-semibold" style={{ color: '#ef4444' }}>
                        -₹{orderForm.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: colors.border.primary }}>
                    <span className="font-semibold text-lg" style={{ color: colors.text.primary }}>Total Amount:</span>
                    <span className="font-bold text-2xl" style={{ color: '#0068ff' }}>
                      ₹{orderForm.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              className="sticky bottom-0 p-6 border-t flex justify-end gap-3"
              style={{ 
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary 
              }}
            >
              <button
                className="px-6 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:bg-opacity-10"
                style={{ 
                  borderColor: colors.border.primary, 
                  color: colors.text.primary,
                  backgroundColor: 'transparent' 
                }}
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#0068ff', color: '#fff' }}
                onClick={() => {
                  if (!orderForm.email?.trim()) {
                    Swal.fire({ icon: 'error', title: 'Required Field', text: 'Please enter customer email' });
                    return;
                  }
                  if (orderForm.items.length === 0) {
                    Swal.fire({ icon: 'error', title: 'No Items', text: 'Please add at least one product to the order' });
                    return;
                  }
                  createOrderMutation.mutate(orderForm);
                }}
                disabled={createOrderMutation.status === "pending"}
              >
                {createOrderMutation.status === "pending" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Success Orders
              </p>
              <h3
                className="text-3xl font-bold mt-1"
                style={{ color: colors.status.success }}
              >
                {completedOrders.length}
              </h3>
            </div>
            <CheckCircle
              className="w-12 h-12"
              style={{ color: colors.status.success, opacity: 0.2 }}
            />
          </div>
        </div>
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Processing Orders
              </p>
              <h3
                className="text-3xl font-bold mt-1"
                style={{ color: "#fff" }}
              >
                {processingOrders.length}
              </h3>
            </div>
            <Clock
              className="w-12 h-12"
              style={{ color: colors.interactive.primary, opacity: 0.2 }}
            />
          </div>
        </div>
        <div
          className="rounded-xl p-6 shadow-sm border transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                Cancelled Orders
              </p>
              <h3
                className="text-3xl font-bold mt-1"
                style={{ color: colors.status.error }}
              >
                {cancelledOrders.length}
              </h3>
            </div>
            <XCircle
              className="w-12 h-12"
              style={{ color: colors.status.error, opacity: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="border-b transition-colors duration-200"

            >
              <tr>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Order ID</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Customer</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Product</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Amount</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Status</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Update Status</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Date</th>
                <th className="text-center py-3 px-4 font-medium" style={{ color: colors.text.primary }}>Actions</th>
              </tr>
            </thead>
            <tbody
              className="divide-y transition-colors duration-200"

            >
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center"
                    style={{ color: colors.text.secondary }}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="transition-colors duration-200"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      className="py-4 px-4 font-medium"
                      style={{ color: colors.interactive.primary }}
                    >
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {order.userId?.fullName ||
                          order.shippingAddress?.fullName ||
                          "N/A"}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {order.userId?.email ||
                          order.shippingAddress?.phoneNumber ||
                          ""}
                      </div>
                    </td>
                    <td
                      className="py-4 px-4"
                      style={{ color: colors.text.primary }}
                    >
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        {order.items?.length || 0} item(s)
                      </div>
                    </td>
                    <td
                      className="py-4 px-4 font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: colors.background.accent,
                          color:
                            order.paymentStatus === "paid"
                              ? colors.status.success
                              : colors.status.warning,
                        }}
                      >
                        {order.paymentStatus?.charAt(0).toUpperCase() +
                          order.paymentStatus?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <select
                        value={
                          editedStatuses[getOrderId(order)] || order.orderStatus
                        }
                        onChange={(e) =>
                          handleStatusSelect(getOrderId(order), e.target.value)
                        }
                        className="border rounded-lg px-3 py-2 focus:ring-2 text-sm transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.secondary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary,
                        }}
                      >
                        <option value="processing">Processing</option>
                        <option value="delivered" style={{ color: '#222', background: '#fff' }}>Success</option>
                        <option value="cancelled" style={{ color: '#222', background: '#fff' }}>Cancelled</option>
                      </select>
                      {editedStatuses[getOrderId(order)] &&
                        editedStatuses[getOrderId(order)] !==
                        order.orderStatus && (
                          <FormButton
                            onClick={() =>
                              handleStatusChange(
                                getOrderId(order),
                                editedStatuses[getOrderId(order)],
                              )
                            }
                            className="text-sm transition-colors duration-200"
                            style={{
                              color: colors.interactive.primary,
                              backgroundColor: "transparent",
                              border: "none",
                            }}
                          >
                            Update
                          </FormButton>
                        )}
                    </td>
                    <td
                      className="py-4 px-4"
                      style={{ color: colors.text.secondary }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                          style={{
                            backgroundColor: colors.background.accent,
                            color: colors.interactive.primary,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.interactive.primary;
                            e.currentTarget.style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.background.accent;
                            e.currentTarget.style.color =
                              colors.interactive.primary;
                          }}
                          title="View order details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          disabled={deleteOrderMutation.isPending}
                          className="p-2 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: colors.background.accent,
                            color: colors.status.error,
                          }}
                          onMouseEnter={(e) => {
                            if (!deleteOrderMutation.isPending) {
                              e.currentTarget.style.backgroundColor =
                                colors.status.error;
                              e.currentTarget.style.color = "#ffffff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              colors.background.accent;
                            e.currentTarget.style.color = colors.status.error;
                          }}
                          title="Delete order"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredOrders.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#fff', color: '#000' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
              style={{
                backgroundColor: '#ffffff',
                borderBottomColor: '#e5e7eb',
              }}
            >
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: '#000' }}
                >
                  Order Details
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: '#6b7280' }}
                >
                  Order #{selectedOrder.orderNumber} • {selectedOrder.orderId}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                <X className="w-6 h-6" style={{ color: '#000' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Status & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: '#fff', borderColor: '#000' }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: '#6b7280' }}
                  >
                    Order Status
                  </p>
                  <p
                    className="text-lg font-semibold capitalize"
                    style={{
                      color:
                        selectedOrder.orderStatus === "delivered"
                          ? colors.status.success
                          : selectedOrder.orderStatus === "cancelled"
                            ? colors.status.error
                            : colors.interactive.primary,
                    }}
                  >
                    {getStatusLabel(selectedOrder.orderStatus)}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: '#fff', borderColor: '#000' }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: '#6b7280' }}
                  >
                    Payment Status
                  </p>
                  <p
                    className="text-lg font-semibold capitalize"
                    style={{
                      color:
                        selectedOrder.paymentStatus === "paid"
                          ? colors.status.success
                          : colors.status.warning,
                    }}
                  >
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: '#fff', borderColor: '#000' }}
                >
                  <p
                    className="text-sm mb-1"
                    style={{ color: '#6b7280' }}
                  >
                    Order Date
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: '#000' }}
                  >
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div
                className="p-5 rounded-lg border"
                style={{ backgroundColor: '#fff', borderColor: '#000' }}
              >
                <h4
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: '#000' }}
                >
                  <User className="w-5 h-5" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User
                      className="w-5 h-5 mt-0.5"
                      style={{ color: colors.text.secondary }}
                    />
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: '#6b7280' }}
                      >
                        Name
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#000' }}
                      >
                        {selectedOrder.shippingAddress.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone
                      className="w-5 h-5 mt-0.5"
                      style={{ color: colors.text.secondary }}
                    />
                    <div>
                      <p
                        className="text-sm"
                        style={{ color: '#6b7280' }}
                      >
                        Phone
                      </p>
                      <p
                        className="font-medium"
                        style={{ color: '#000' }}
                      >
                        {selectedOrder.shippingAddress.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.userId?.email && (
                    <div className="flex items-start gap-3">
                      <Mail
                        className="w-5 h-5 mt-0.5"
                        style={{ color: colors.text.secondary }}
                      />
                      <div>
                        <p
                          className="text-sm"
                          style={{ color: '#6b7280' }}
                        >
                          Email
                        </p>
                        <p
                          className="font-medium"
                          style={{ color: '#000' }}
                        >
                          {selectedOrder.userId.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Products */}
              <div
                className="p-5 rounded-lg border"
                style={{ backgroundColor: '#fff', borderColor: '#000' }}

              >
                <h4
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: '#000' }}
                >
                  <Package className="w-5 h-5" />
                  Ordered Products ({selectedOrder.items.length} items)
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => {
                    console.log(`🔍 Rendering item ${index}:`, {
                      name: item.name,
                      version: item.version,
                      pricingPlan: item.pricingPlan,
                      hasVersion: !!item.version,
                      hasPricingPlan: !!item.pricingPlan,
                      fullItem: item
                    });

                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg"
                        style={{ backgroundColor: '#fff' }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-semibold text-base mb-2"
                            style={{ color: '#000' }}
                          >
                            {item.name}
                          </p>

                          <div className="mt-2 space-y-1.5">
                            {/* Product ID - Always show */}
                            <p
                              className="text-xs"
                              style={{ color: '#6b7280' }}
                            >
                              <span className="font-medium" style={{ color: '#000' }}>Product ID:</span> {item.productId}
                            </p>

                            {/* Version - Show if available */}
                            {item.version ? (
                              <p
                                className="text-sm flex items-center gap-2"
                                style={{ color: '#6b7280' }}
                              >
                                <span className="font-medium" style={{ color: '#000' }}>Version:</span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium" style={{
                                  backgroundColor: "#000",
                                  color: "#000"
                                }}>
                                  {item.version}
                                </span>
                              </p>
                            ) : (
                              <p
                                className="text-xs"
                                style={{ color: "#000" }}
                              >
                                <span className="font-medium" style={{ color: '#000' }}>Version:</span> <span style={{ opacity: 0.6, color: '#000' }}>Not specified</span>
                              </p>
                            )}

                            {/* Pricing Plan - Show if available */}
                            {item.pricingPlan ? (
                              <p
                                className="text-sm flex items-center gap-2"
                                style={{ color: '#6b7280' }}
                              >
                                <span className="font-medium" style={{ color: '#000' }}>Plan:</span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium capitalize" style={{
                                  backgroundColor: colors.background.accent,
                                  color: colors.interactive.primary
                                }}>
                                  {item.pricingPlan}
                                </span>
                              </p>
                            ) : (
                              <p
                                className="text-xs"
                                style={{ color: colors.text.secondary }}
                              >
                                <span className="font-medium" style={{ color: colors.text.primary }}>Plan:</span> <span style={{ opacity: 0.6 }}>Not specified</span>
                              </p>
                            )}

                            {/* Quantity and Price */}
                            <p
                              className="text-sm mt-2 pt-2"
                              style={{
                                color: '#6b7280',
                                borderTop: `1px solid #e5e7eb`
                              }}
                            >
                              <span className="font-medium" style={{ color: '#000' }}>Quantity:</span> {item.quantity} × ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className="font-bold text-lg"
                            style={{ color: '#000' }}
                          >
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div
                className="p-5 rounded-lg border"

              >
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: '#000' }}
                >
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: '#000' }}>
                      Subtotal
                    </span>
                    <span style={{ color: '#000' }}>
                      ₹{selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#000' }}>
                        Discount
                      </span>
                      <span style={{ color: colors.status.success }}>
                        -₹{selectedOrder.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.shippingCharges > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: '#000' }}>
                        Shipping
                      </span>
                      <span style={{ color: '#000' }}>
                        ₹{selectedOrder.shippingCharges.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex justify-between pt-3 border-t text-lg font-bold"
                    style={{ borderTopColor: '#e5e7eb' }}
                  >
                    <span style={{ color: '#000' }}>
                      Total Amount
                    </span>
                    <span style={{ color: colors.interactive.primary }}>
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedOrder.notes && (
                <div
                  className="p-5 rounded-lg border"

                >
                  <h4
                    className="text-lg font-semibold mb-2"
                    style={{ color: '#000' }}
                  >
                    Notes
                  </h4>
                  <p style={{ color: '#000' }}>
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Payment Details */}
              {selectedOrder.cashfreePaymentId && (
                <div
                  className="p-5 rounded-lg border"

                >
                  <h4
                    className="text-lg font-semibold mb-3"
                    style={{ color: '#000' }}
                  >
                    Payment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {selectedOrder.cashfreePaymentId && (
                      <>
                        <div className="flex justify-between">
                          <span style={{ color: '#000' }}>
                            Payment ID
                          </span>
                          <span
                            className="font-mono"
                            style={{ color: '#000' }}
                          >
                            {selectedOrder.cashfreePaymentId}
                          </span>
                        </div>
                        {selectedOrder.cashfreeOrderId && (
                          <div className="flex justify-between">
                            <span style={{ color: '#000' }}>
                              Cashfree Order ID
                            </span>
                            <span
                              className="font-mono"
                              style={{ color: '#000' }}
                            >
                              {selectedOrder.cashfreeOrderId}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="sticky bottom-0 p-6 border-t flex justify-end"
              style={{
                backgroundColor: "#ffffff",
                borderTopColor: "#e5e7eb",
              }}
            >
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: "#000",
                  color: "#ffffff",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
