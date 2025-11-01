import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, CheckCircle, XCircle, Clock, Eye, X, Phone, Mail, User, Trash2 } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import { getAllOrders, updateOrderStatus, deleteAdminOrder } from '../../api/adminOrderApi';
import FormButton from '../../components/Button/FormButton';
import Swal from 'sweetalert2';

const Orders: React.FC = () => {
  const { colors } = useAdminTheme();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editedStatuses, setEditedStatuses] = useState<Record<string, string>>({});
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch all orders
  const { data, isLoading } = useQuery({
    queryKey: ['adminOrders', statusFilter],
    queryFn: () => getAllOrders({ status: statusFilter || undefined, limit: 100 }),
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('📡 Calling API with:', { orderId, status });
      return updateOrderStatus(orderId, status);
    },
    onSuccess: (data) => {
      console.log('✅ Update successful:', data);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Order status updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      // Invalidate all admin order queries
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      // Invalidate all user order queries (this will refresh My Orders page)
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      // Refetch immediately to ensure UI is up to date
      queryClient.refetchQueries({ queryKey: ['adminOrders'] });
      queryClient.refetchQueries({ queryKey: ['userOrders'] });
      // Clear the edited status after successful update
      setEditedStatuses({});
    },
    onError: (error: any) => {
      console.error('❌ Update failed:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.response?.data?.message);
      console.error('Error status:', error.response?.status);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update order status',
        footer: error.response?.status ? `Status Code: ${error.response.status}` : ''
      });
    },
  });

  // Delete order mutation (Admin only)
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => {
      console.log('🗑️ Deleting order:', orderId);
      return deleteAdminOrder(orderId);
    },
    onSuccess: (data) => {
      console.log('✅ Delete successful:', data);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Order has been deleted successfully',
        timer: 2000,
        showConfirmButton: false
      });
      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      queryClient.refetchQueries({ queryKey: ['adminOrders'] });
    },
    onError: (error: any) => {
      console.error('❌ Delete failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to delete order',
      });
    },
  });

  // Helper to get the correct order ID (orderId for API, _id as fallback)
  const getOrderId = (order: any): string => {
    return order.orderId || order._id;
  };

  const orders = data?.data?.orders || [];

  // Debug: Log first order to check structure
  if (orders.length > 0) {
    console.log('📦 First order structure:', orders[0]);
    console.log('📦 First order orderId:', orders[0].orderId);
    console.log('📦 First order _id:', orders[0]._id);
    console.log('📦 Using ID for updates:', getOrderId(orders[0]));
  }

  const completedOrders = orders.filter((o: any) => o.orderStatus === 'delivered');
  const processingOrders = orders.filter((o: any) => o.orderStatus === 'processing');
  const cancelledOrders = orders.filter((o: any) => o.orderStatus === 'cancelled');

  const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === 'delivered') return 'Success';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleStatusSelect = (orderId: string, newStatus: string) => {
    setEditedStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    console.log('🔄 Attempting to update order:', { orderId, newStatus });

    if (!orderId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Order ID is missing. Cannot update status.'
      });
      console.error('❌ orderId is undefined or empty:', orderId);
      return;
    }

    Swal.fire({
      title: 'Update Order Status?',
      text: `Are you sure you want to change the status to ${getStatusLabel(newStatus)}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('✅ User confirmed, calling mutation...');
        updateStatusMutation.mutate({
          orderId,
          status: newStatus,
        });
      } else {
        console.log('❌ User cancelled update');
      }
    });
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (order: any) => {
    Swal.fire({
      title: 'Delete Order?',
      html: `Are you sure you want to delete order <strong>#${order.orderNumber}</strong>?<br/><small>This action cannot be undone.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('✅ Admin confirmed delete, calling mutation...');
        deleteOrderMutation.mutate(getOrderId(order));
      } else {
        console.log('❌ Admin cancelled delete');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: colors.interactive.primary }}></div>
          <p style={{ color: colors.text.secondary }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
          Orders Management
        </h2>
        <div className="flex items-center space-x-3">
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
              <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.success }}>
                {completedOrders.length}
              </h3>
            </div>
            <CheckCircle className="w-12 h-12" style={{ color: colors.status.success, opacity: 0.2 }} />
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
              <h3 className="text-3xl font-bold mt-1" style={{ color: colors.interactive.primary }}>
                {processingOrders.length}
              </h3>
            </div>
            <Clock className="w-12 h-12" style={{ color: colors.interactive.primary, opacity: 0.2 }} />
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
              <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.error }}>
                {cancelledOrders.length}
              </h3>
            </div>
            <XCircle className="w-12 h-12" style={{ color: colors.status.error, opacity: 0.2 }} />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="border-b transition-colors duration-200"
              style={{
                backgroundColor: colors.background.tertiary,
                borderBottomColor: colors.border.primary
              }}
            >
              <tr>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Order ID
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Customer
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Product
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Amount
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Status
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Date
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Update Status
                </th>
                <th
                  className="text-center py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y transition-colors duration-200" style={{ borderColor: colors.border.secondary }}>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center" style={{ color: colors.text.secondary }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="transition-colors duration-200"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td className="py-4 px-4 font-medium" style={{ color: colors.interactive.primary }}>
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium" style={{ color: colors.text.primary }}>
                        {order.userId?.fullName || order.shippingAddress?.fullName || 'N/A'}
                      </div>
                      <div className="text-sm" style={{ color: colors.text.secondary }}>
                        {order.userId?.email || order.shippingAddress?.phoneNumber || ''}
                      </div>
                    </td>
                    <td className="py-4 px-4" style={{ color: colors.text.primary }}>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        {order.items?.length || 0} item(s)
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium" style={{ color: colors.text.primary }}>
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: colors.background.accent,
                          color: order.paymentStatus === 'paid' ? colors.status.success : colors.status.warning,
                        }}
                      >
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex items-center gap-2">
                      <select
                        value={editedStatuses[getOrderId(order)] || order.orderStatus}
                        onChange={(e) => handleStatusSelect(getOrderId(order), e.target.value)}
                        className="border rounded px-2 py-1 text-sm transition-colors duration-200"
                        style={{
                          backgroundColor: colors.background.tertiary,
                          borderColor: colors.border.primary,
                          color: colors.text.primary
                        }}
                      >
                        <option value="processing">Processing</option>
                        <option value="delivered">Success</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {editedStatuses[getOrderId(order)] && editedStatuses[getOrderId(order)] !== order.orderStatus && (
                        <FormButton
                          onClick={() => handleStatusChange(getOrderId(order), editedStatuses[getOrderId(order)])}
                          className="text-sm transition-colors duration-200"
                          style={{
                            color: colors.interactive.primary,
                            backgroundColor: 'transparent',
                            border: 'none'
                          }}
                        >
                          Update
                        </FormButton>
                      )}
                    </td>
                    <td className="py-4 px-4" style={{ color: colors.text.secondary }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
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
                            e.currentTarget.style.backgroundColor = colors.interactive.primary;
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.background.accent;
                            e.currentTarget.style.color = colors.interactive.primary;
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
                              e.currentTarget.style.backgroundColor = colors.status.error;
                              e.currentTarget.style.color = '#ffffff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.background.accent;
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

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.background.secondary }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
              style={{
                backgroundColor: colors.background.secondary,
                borderBottomColor: colors.border.primary,
              }}
            >
              <div>
                <h3 className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                  Order Details
                </h3>
                <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                  Order #{selectedOrder.orderNumber} • {selectedOrder.orderId}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                style={{ backgroundColor: colors.background.accent }}
              >
                <X className="w-6 h-6" style={{ color: colors.text.primary }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Order Status & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>
                    Order Status
                  </p>
                  <p
                    className="text-lg font-semibold capitalize"
                    style={{
                      color:
                        selectedOrder.orderStatus === 'delivered'
                          ? colors.status.success
                          : selectedOrder.orderStatus === 'cancelled'
                            ? colors.status.error
                            : colors.interactive.primary,
                    }}
                  >
                    {getStatusLabel(selectedOrder.orderStatus)}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>
                    Payment Status
                  </p>
                  <p
                    className="text-lg font-semibold capitalize"
                    style={{
                      color:
                        selectedOrder.paymentStatus === 'paid'
                          ? colors.status.success
                          : colors.status.warning,
                    }}
                  >
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
                <div
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>
                    Order Date
                  </p>
                  <p className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                }}
              >
                <h4
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <User className="w-5 h-5" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
                    <div>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        Name
                      </p>
                      <p className="font-medium" style={{ color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
                    <div>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        Phone
                      </p>
                      <p className="font-medium" style={{ color: colors.text.primary }}>
                        {selectedOrder.shippingAddress.phoneNumber}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.userId?.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
                      <div>
                        <p className="text-sm" style={{ color: colors.text.secondary }}>
                          Email
                        </p>
                        <p className="font-medium" style={{ color: colors.text.primary }}>
                          {selectedOrder.userId.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {/* <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                }}
              >
                <h4
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h4>
                <div style={{ color: colors.text.primary }}>
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="mt-2">{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p className="mt-2 font-medium">Phone: {selectedOrder.shippingAddress.phoneNumber}</p>
                </div>
              </div> */}

              {/* Ordered Products */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                }}
              >
                <h4
                  className="text-lg font-semibold mb-4 flex items-center gap-2"
                  style={{ color: colors.text.primary }}
                >
                  <Package className="w-5 h-5" />
                  Ordered Products ({selectedOrder.items.length} items)
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg"
                      style={{ backgroundColor: colors.background.secondary }}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: colors.text.primary }}>
                          {item.name}
                        </p>
                        <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
                          Quantity: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: colors.text.primary }}>
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderColor: colors.border.primary,
                }}
              >
                <h4
                  className="text-lg font-semibold mb-4"
                  style={{ color: colors.text.primary }}
                >
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: colors.text.secondary }}>Subtotal</span>
                    <span style={{ color: colors.text.primary }}>
                      ₹{selectedOrder.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Discount</span>
                      <span style={{ color: colors.status.success }}>
                        -₹{selectedOrder.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.shippingCharges > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Shipping</span>
                      <span style={{ color: colors.text.primary }}>
                        ₹{selectedOrder.shippingCharges.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedOrder.tax > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Tax</span>
                      <span style={{ color: colors.text.primary }}>
                        ₹{selectedOrder.tax.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div
                    className="flex justify-between pt-3 border-t text-lg font-bold"
                    style={{ borderTopColor: colors.border.primary }}
                  >
                    <span style={{ color: colors.text.primary }}>Total Amount</span>
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
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <h4
                    className="text-lg font-semibold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    Notes
                  </h4>
                  <p style={{ color: colors.text.secondary }}>{selectedOrder.notes}</p>
                </div>
              )}

              {/* Payment Details */}
              {selectedOrder.razorpayPaymentId && (
                <div
                  className="p-5 rounded-lg border"
                  style={{
                    backgroundColor: colors.background.tertiary,
                    borderColor: colors.border.primary,
                  }}
                >
                  <h4
                    className="text-lg font-semibold mb-3"
                    style={{ color: colors.text.primary }}
                  >
                    Payment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.text.secondary }}>Payment ID</span>
                      <span className="font-mono" style={{ color: colors.text.primary }}>
                        {selectedOrder.razorpayPaymentId}
                      </span>
                    </div>
                    {selectedOrder.razorpayOrderId && (
                      <div className="flex justify-between">
                        <span style={{ color: colors.text.secondary }}>Razorpay Order ID</span>
                        <span className="font-mono" style={{ color: colors.text.primary }}>
                          {selectedOrder.razorpayOrderId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="sticky bottom-0 p-6 border-t flex justify-end"
              style={{
                backgroundColor: colors.background.secondary,
                borderTopColor: colors.border.primary,
              }}
            >
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: '#ffffff',
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