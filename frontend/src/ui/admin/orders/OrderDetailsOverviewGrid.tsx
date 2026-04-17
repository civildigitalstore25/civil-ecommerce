import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { getStatusLabel, normOrderStatus, type AdminOrderLike } from "./adminOrderUtils";

type Props = {
  colors: ThemeColors;
  order: AdminOrderLike;
};

const OrderDetailsOverviewGrid: React.FC<Props> = ({ colors, order }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="p-4 rounded-lg border" style={{ backgroundColor: "#fff", borderColor: "#000" }}>
      <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
        Order Status
      </p>
      <p
        className="text-lg font-semibold capitalize"
        style={{
          color:
            normOrderStatus(order.orderStatus) === "delivered"
              ? colors.status.success
              : normOrderStatus(order.orderStatus) === "cancelled"
                ? colors.status.error
                : normOrderStatus(order.orderStatus) === "pending"
                  ? colors.status.info
                  : colors.status.warning,
        }}
      >
        {getStatusLabel(order.orderStatus)}
      </p>
    </div>
    <div className="p-4 rounded-lg border" style={{ backgroundColor: "#fff", borderColor: "#000" }}>
      <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
        Payment Status
      </p>
      <p
        className="text-lg font-semibold capitalize"
        style={{
          color:
            order.paymentStatus === "paid" ? colors.status.success : colors.status.warning,
        }}
      >
        {order.paymentStatus ?? "—"}
      </p>
    </div>
    <div className="p-4 rounded-lg border" style={{ backgroundColor: "#fff", borderColor: "#000" }}>
      <p className="text-sm mb-1" style={{ color: "#6b7280" }}>
        Order Date
      </p>
      <p className="text-lg font-semibold" style={{ color: "#000" }}>
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </p>
    </div>
  </div>
);

export default OrderDetailsOverviewGrid;
