import React from "react";
import { X } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderLike } from "./adminOrderUtils";
import OrderDetailsOverviewGrid from "./OrderDetailsOverviewGrid";
import OrderDetailsCustomerCard from "./OrderDetailsCustomerCard";
import OrderDetailsItemsList from "./OrderDetailsItemsList";
import OrderDetailsSummaryBlocks from "./OrderDetailsSummaryBlocks";
import { useEnrichedOrderLineItems } from "./useEnrichedOrderLineItems";

type Props = {
  colors: ThemeColors;
  order: AdminOrderLike;
  onClose: () => void;
};

const OrderDetailsModal: React.FC<Props> = ({ colors, order, onClose }) => {
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = useEnrichedOrderLineItems(rawItems) as typeof rawItems;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#fff", color: "#000" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b z-10"
          style={{
            backgroundColor: "#ffffff",
            borderBottomColor: "#e5e7eb",
          }}
        >
          <div>
            <h3 className="text-2xl font-bold" style={{ color: "#000" }}>
              Order Details
            </h3>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
              Order #{order.orderNumber} • {order.orderId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            <X className="w-6 h-6" style={{ color: "#000" }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <OrderDetailsOverviewGrid colors={colors} order={order} />
          <OrderDetailsCustomerCard colors={colors} order={order} />
          <OrderDetailsItemsList colors={colors} items={items} />
          <OrderDetailsSummaryBlocks
            colors={colors}
            subtotal={Number(order.subtotal ?? 0)}
            discount={Number(order.discount ?? 0)}
            shippingCharges={Number(order.shippingCharges ?? 0)}
            totalAmount={Number(order.totalAmount ?? 0)}
            notes={order.notes}
            cashfreePaymentId={order.cashfreePaymentId}
            cashfreeOrderId={order.cashfreeOrderId}
          />
        </div>

        <div
          className="sticky bottom-0 p-6 border-t flex justify-end"
          style={{
            backgroundColor: "#ffffff",
            borderTopColor: "#e5e7eb",
          }}
        >
          <button
            type="button"
            onClick={onClose}
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
  );
};

export default OrderDetailsModal;
