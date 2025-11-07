import React from "react";
import { Tag } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import type { IOrder } from "../../api/types/orderTypes";

interface OrderSummaryProps {
  order: IOrder;
}

const OrderSummary: React.FC<OrderSummaryProps> = React.memo(({ order }) => {
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  return (
    <div
      className="p-3 sm:p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.tertiary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag
          className="w-4 h-4 sm:w-5 sm:h-5"
          style={{ color: colors.interactive.primary }}
        />
        <h4
          className="font-bold text-sm sm:text-base"
          style={{ color: colors.text.primary }}
        >
          Order Summary
        </h4>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span style={{ color: colors.text.secondary }}>Subtotal:</span>
          <span
            className="font-semibold"
            style={{ color: colors.text.primary }}
          >
            {formatPriceWithSymbol(order.subtotal)}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span style={{ color: colors.text.secondary }}>Discount:</span>
            <span
              className="font-semibold"
              style={{ color: colors.status.success }}
            >
              -{formatPriceWithSymbol(order.discount)}
            </span>
          </div>
        )}

        <div
          className="border-t pt-2 mt-3"
          style={{ borderColor: colors.border.primary }}
        >
          <div className="flex justify-between items-center">
            <span
              className="font-bold text-sm sm:text-base"
              style={{ color: colors.text.primary }}
            >
              Total:
            </span>
            <span
              className="text-lg sm:text-xl font-bold"
              style={{ color: colors.interactive.primary }}
            >
              {formatPriceWithSymbol(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

OrderSummary.displayName = "OrderSummary";

export default OrderSummary;
