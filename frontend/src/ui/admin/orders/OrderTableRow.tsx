import React from "react";
import { Package, Eye, Trash2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderLike } from "./adminOrderUtils";
import {
  buildOrderWhatsAppUrl,
  displayOrderCustomerEmail,
  displayOrderCustomerPhone,
  getOrderId,
  getStatusLabel,
  normOrderStatus,
} from "./adminOrderUtils";

type Props = {
  colors: ThemeColors;
  order: AdminOrderLike;
  selectedOrders: string[];
  onSelectOrder: (id: string) => void;
  onViewDetails: (order: AdminOrderLike) => void;
  onDeleteOrder: (order: AdminOrderLike) => void;
  deletePending: boolean;
};

const OrderTableRow: React.FC<Props> = ({
  colors,
  order,
  selectedOrders,
  onSelectOrder,
  onViewDetails,
  onDeleteOrder,
  deletePending,
}) => {
  const whatsappUrl = buildOrderWhatsAppUrl(order);

  const handleWhatsAppClick = () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <tr
      className="transition-colors duration-200"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = colors.background.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <td className="text-center py-4 px-4">
        <input
          type="checkbox"
          checked={selectedOrders.includes(getOrderId(order))}
          onChange={() => onSelectOrder(getOrderId(order))}
          className="w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="py-4 px-4 font-medium" style={{ color: colors.interactive.primary }}>
        #{order.orderNumber}
      </td>
      <td className="py-4 px-4">
        <div className="font-medium" style={{ color: colors.text.primary }}>
          {order.userId?.fullName || order.shippingAddress?.fullName || "N/A"}
        </div>
        <div className="text-sm space-y-0.5" style={{ color: colors.text.secondary }}>
          {displayOrderCustomerEmail(order) && (
            <div className="truncate" title={displayOrderCustomerEmail(order)}>
              {displayOrderCustomerEmail(order)}
            </div>
          )}
          {displayOrderCustomerPhone(order) && (
            <div className="truncate" title={displayOrderCustomerPhone(order)}>
              {displayOrderCustomerPhone(order)}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-4" style={{ color: colors.text.primary }}>
        <div className="flex items-center">
          <Package className="w-4 h-4 mr-2" />
          {order.items?.length || 0} item(s)
        </div>
      </td>
      <td className="py-4 px-4 font-medium" style={{ color: colors.text.primary }}>
        ₹{Number(order.totalAmount ?? 0).toLocaleString()}
      </td>
      <td className="py-4 px-4">
        <span
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
          style={{
            backgroundColor: colors.background.accent,
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
          {getStatusLabel(order.orderStatus || "processing")}
        </span>
      </td>
      <td className="py-4 px-4" style={{ color: colors.text.secondary }}>
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—"}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleWhatsAppClick}
            disabled={!whatsappUrl}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.background.accent,
              color: "#25D366",
            }}
            onMouseEnter={(e) => {
              if (whatsappUrl) {
                e.currentTarget.style.backgroundColor = "#25D366";
                e.currentTarget.style.color = "#ffffff";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.accent;
              e.currentTarget.style.color = "#25D366";
            }}
            title={whatsappUrl ? "Send WhatsApp message" : "Customer phone number unavailable"}
            aria-label={whatsappUrl ? "Send WhatsApp message" : "Customer phone number unavailable"}
          >
            <FaWhatsapp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.interactive.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.interactive.primary;
              e.currentTarget.style.color = "#ffffff";
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
            type="button"
            onClick={() => onDeleteOrder(order)}
            disabled={deletePending}
            className="p-2 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.background.accent,
              color: colors.status.error,
            }}
            onMouseEnter={(e) => {
              if (!deletePending) {
                e.currentTarget.style.backgroundColor = colors.status.error;
                e.currentTarget.style.color = "#ffffff";
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
  );
};

export default OrderTableRow;
