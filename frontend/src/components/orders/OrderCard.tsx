import React from 'react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';
import type { IOrder } from '../../api/types/orderTypes';
import ProductInfo from './ProductInfo';
import OrderSummary from './OrderSummary';

interface OrderCardProps {
  order: IOrder;
  onToggleExpansion: () => void;
  onBuyAgain: () => void;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(({
  order,
  onToggleExpansion,
  onBuyAgain
}) => {
  const { colors } = useAdminTheme();

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'DELIVERED':
        return colors.status.success;
      case 'PENDING':
        return colors.status.warning;
      case 'CANCELLED':
        return colors.status.error;
      case 'SHIPPED':
        return colors.interactive.primary;
      case 'PROCESSING':
        return colors.interactive.primary;
      case 'PAID':
        return colors.status.success;
      case 'FAILED':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === 'delivered') return 'Success';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatOrderDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="relative rounded-lg border transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.interactive.primary
      }}
    >
      

      {/* Order Header */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div
                className="text-sm font-semibold mb-1"
                style={{ color: getStatusColor(order.orderStatus) }}
              >
                {getStatusLabel(order.orderStatus)}
              </div>
              <div
                className="text-xs sm:text-sm"
                style={{ color: colors.text.secondary }}
              >
                Placed on {formatOrderDate(order.createdAt)}
              </div>
            </div>
          </div>

          <div
            className="text-left sm:text-right"
            style={{ color: colors.text.secondary }}
          >
            <div className="text-xs sm:text-sm sm:mr-8">#Order No : {order.orderNumber}</div>
          </div>
        </div>

        {/* Product and Summary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Card */}
          <ProductInfo
            order={order}
            onBuyAgain={onBuyAgain}
            onViewDetails={onToggleExpansion}
          />

          {/* Order Summary Card */}
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
