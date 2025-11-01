import type { IOrder } from '../api/types/orderTypes';

/**
 * Check if an order can be deleted
 * Only allow deletion of orders that are not paid or are cancelled
 */
export const canDeleteOrder = (order: IOrder): boolean => {
  return order.paymentStatus !== 'paid' || order.orderStatus === 'cancelled';
};

/**
 * Get status color based on order status
 */
export const getStatusColor = (status: string): string => {
  const normalizedStatus = status.toUpperCase();
  const statusColors = {
    DELIVERED: '#10b981', // green
    PENDING: '#f59e0b',   // yellow
    CANCELLED: '#ef4444', // red
    SHIPPED: '#fbbf24',   // yellow (primary)
    PROCESSING: '#3b82f6', // blue
    PAID: '#10b981',      // green
    FAILED: '#ef4444',    // red
  };

  return statusColors[normalizedStatus as keyof typeof statusColors] || '#6b7280'; // gray default
};

/**
 * Format order date for display
 */
export const formatOrderDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format full date for display
 */
export const formatFullDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Validate product image URL
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  return !!(url && url !== 'null' && url.trim() !== '');
};

/**
 * Get sort options for orders
 */
export const getSortOptions = () => [
  { value: 'recent', label: 'Last 6 months' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'amount', label: 'Amount (High to Low)' },
  { value: 'status', label: 'Status' },
];
