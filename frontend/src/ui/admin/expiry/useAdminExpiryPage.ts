import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getExpiredProducts,
} from "../../../api/adminExpiryApi";

/**
 * Hook for managing the Expiry page state and data
 */
export function useAdminExpiryPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch expired products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminExpiredProducts", currentPage, pageSize, searchTerm],
    queryFn: () =>
      getExpiredProducts({
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
      }),
  });

  const expiredProducts = data?.data || [];
  const pagination = data?.pagination || {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  };

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Clear selections when data changes
  useEffect(() => {
    setSelectedProducts([]);
  }, [expiredProducts]);

  const handleSelectAll = () => {
    if (selectedProducts.length === expiredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(expiredProducts.map((p) => p._id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Calculate expiry distribution for stats
  const calculateExpiryDistribution = () => {
    const distribution = {
      recentlyExpired: 0, // 0-7 days
      moderatelyExpired: 0, // 7-30 days
      oldExpiry: 0, // 30-90 days
      veryOldExpiry: 0, // 90+ days
    };

    for (const product of expiredProducts) {
      const days = product.daysSinceExpiry;
      if (days <= 7) distribution.recentlyExpired++;
      else if (days <= 30) distribution.moderatelyExpired++;
      else if (days <= 90) distribution.oldExpiry++;
      else distribution.veryOldExpiry++;
    }

    return distribution;
  };

  return {
    // Data
    expiredProducts,
    pagination,
    isLoading,
    isError,
    error,

    // Search & Filter
    searchTerm,
    setSearchTerm,

    // Pagination
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages: pagination.totalPages,
    totalCount: pagination.totalCount,

    // Selection
    selectedProducts,
    handleSelectAll,
    handleSelectProduct,

    // Stats
    expiryDistribution: calculateExpiryDistribution(),
  };
}
