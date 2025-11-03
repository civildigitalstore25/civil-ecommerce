import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAdminTheme } from '../contexts/AdminThemeContext';
import { getUserOrders, deleteOrder } from '../api/orderApi';
import type { IOrder } from '../api/types/orderTypes';
import { canDeleteOrder } from '../utils/orderUtils';

// Components
import LoadingState from '../components/orders/LoadingState';
import ErrorState from '../components/orders/ErrorState';
import EmptyState from '../components/orders/EmptyState';
import SortDropdown from '../components/orders/SortDropdown';
import OrderCard from '../components/orders/OrderCard';

const MyOrdersPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>('recent');
  const { colors } = useAdminTheme();
  const queryClient = useQueryClient();

  // Queries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userOrders'],
    queryFn: getUserOrders,
    staleTime: 30 * 1000, // 30 seconds - shorter to pick up admin updates faster
    refetchOnWindowFocus: true, // Refetch when user returns to page
    refetchInterval: 30000, // Auto-refetch every 30 seconds to catch admin updates
  });

  // Mutations
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (data) => {
      toast.success(data.message || 'Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  });

  // Memoized data processing
  const orders = useMemo(() => {
    if (!data?.data) return [];

    // Handle both array and object responses
    const ordersList = Array.isArray(data.data) ? data.data : [];

    // Sort orders based on selected option
    return [...ordersList].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'status':
          return a.orderStatus.localeCompare(b.orderStatus);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [data?.data, sortBy]);

  // Event handlers
  const handleToggleExpansion = useCallback(() => {
    // Toggle expansion functionality can be implemented here if needed
  }, []);

  const handleDeleteOrder = useCallback((orderId: string, orderNumber: number) => {
    if (window.confirm(`Are you sure you want to delete order #${orderNumber}? This action cannot be undone.`)) {
      deleteOrderMutation.mutate(orderId);
    }
  }, [deleteOrderMutation]);

  const handleBuyAgain = useCallback((order: IOrder) => {
    // TODO: Implement buy again functionality
    toast.success(`Adding ${order.items[0]?.name || 'product'} to cart...`);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error as Error} onRetry={refetch} />;
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div
        className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: colors.text.primary }}
            >
              My Orders
            </h1>
          </div>
          <EmptyState />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200 pt-20"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            My Orders
          </h1>

          <SortDropdown
            value={sortBy}
            onChange={handleSortChange}
          />
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order: IOrder) => (
            <OrderCard
              key={order._id}
              order={order}
              onToggleExpansion={handleToggleExpansion}
              onBuyAgain={() => handleBuyAgain(order)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;