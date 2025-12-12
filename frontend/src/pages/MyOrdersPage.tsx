import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getUserOrders } from "../api/orderApi";
import type { IOrder } from "../api/types/orderTypes";

// Components
import LoadingState from "../components/orders/LoadingState";
import ErrorState from "../components/orders/ErrorState";
import EmptyState from "../components/orders/EmptyState";
import SortDropdown from "../components/orders/SortDropdown";
import OrderCard from "../components/orders/OrderCard";

const MyOrdersPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<string>("recent");
  const { colors } = useAdminTheme();

  // Queries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userOrders"],
    queryFn: getUserOrders,
    staleTime: 30 * 1000, // 30 seconds - shorter to pick up admin updates faster
    refetchOnWindowFocus: true, // Refetch when user returns to page
    refetchInterval: 30000, // Auto-refetch every 30 seconds to catch admin updates
  });

  // Memoized data processing
  const orders = useMemo(() => {
    if (!data?.data) return [];

    // Handle both array and object responses
    const ordersList = Array.isArray(data.data) ? data.data : [];

    // Sort orders based on selected option
    return [...ordersList].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "amount":
          return b.totalAmount - a.totalAmount;
        case "status":
          return a.orderStatus.localeCompare(b.orderStatus);
        case "recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  }, [data?.data, sortBy]);

  // Event handlers
  const handleToggleExpansion = useCallback(() => {
    // Toggle expansion functionality can be implemented here if needed
  }, []);

  const handleBuyAgain = useCallback((order: IOrder) => {
    // TODO: Implement buy again functionality
    toast.success(`Adding ${order.items[0]?.name || "product"} to cart...`);
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
        className="min-h-screen transition-colors duration-200 pt-20"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="mb-4 sm:mb-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold transition-colors duration-200"
                  style={{ color: colors.text.primary }}
                >
                  My Orders
                </h1>
              </div>
            </div>
          </div>
          <EmptyState />
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                My Orders
              </h1>
            </div>
            <SortDropdown value={sortBy} onChange={handleSortChange} />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order: IOrder) => (
            <div
              key={order._id}
              className="rounded-lg sm:rounded-xl border p-3 sm:p-6 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <OrderCard
                order={order}
                onToggleExpansion={handleToggleExpansion}
                onBuyAgain={() => handleBuyAgain(order)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
