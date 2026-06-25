import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import type { IOrder } from "../../api/types/orderTypes";
import { ProductInfoPanel } from "./productInfo/ProductInfoPanel";
import OrderSummary from "./OrderSummary";

interface OrderCardProps {
  order: IOrder;
}

const OrderCard: React.FC<OrderCardProps> = React.memo(
  ({ order }) => {
    const { colors } = useAdminTheme();
    // @ts-ignore: If theme is not present, fallback to 'light'
    const theme = (colors as any).theme || 'light';

    const effectiveOrderStatus =
      order.orderStatus?.toLowerCase() === "shipped"
        ? "processing"
        : order.orderStatus || "pending";

    const getStatusColor = (status: string) => {
      const normalizedStatus = status.toUpperCase();
      switch (normalizedStatus) {
        case "DELIVERED":
          return colors.status.success;
        case "PENDING":
          return colors.status.warning;
        case "CANCELLED":
          return colors.status.error;
        case "PROCESSING":
          return colors.interactive.primary;
        case "PAID":
          return colors.status.success;
        case "FAILED":
          return colors.status.error;
        default:
          return colors.text.secondary;
      }
    };

    const getStatusLabel = (status: string) => {
      if (status.toLowerCase() === "delivered") return "Success";
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatOrderDate = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <div
        className="relative rounded-lg border transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.interactive.primary,
        }}
      >
        {/* Order Header */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <div>
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: getStatusColor(effectiveOrderStatus) }}
                >
                  {getStatusLabel(effectiveOrderStatus)}
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
              <div className="text-xs sm:text-sm sm:mr-8">
                #Order No : {order.orderNumber}
              </div>
            </div>
          </div>

          {/* Product and Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Product Cards: Show all items in the order */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <ProductInfoPanel
                  key={item.productId || idx}
                  order={order}
                  product={item}
                  colors={colors}
                  theme={theme}
                  formatPriceWithSymbol={(price) => price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                />
              ))}
            </div>

            {/* Order Summary Card */}
            <OrderSummary order={order} />
          </div>

          {/* Debug: Show order items data */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 text-xs" style={{
                background: 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
                color: colors.text.inverse,
                border: 'none',
              }}>
              Debug: Order has {order.items.length} item(s) | 
              First item driveLink: {order.items[0]?.driveLink ? '✓ Present' : '✗ Missing'} | 
              Payment: {order.paymentStatus} | 
              Status: {order.orderStatus}
            </div>
          )} */}
        </div>
      </div>
    );
  },
);

OrderCard.displayName = "OrderCard";

export default OrderCard;
