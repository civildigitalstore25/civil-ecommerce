import React from "react";
import { Clock, Package } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import {
  buildExpiryWhatsAppUrl,
  displayOrderCustomerEmail,
  displayOrderCustomerPhone,
  normalizeWhatsAppPhone,
  type ExpiryOrderItem,
} from "./adminOrderUtils";

type Props = {
  colors: ThemeColors;
  items: ExpiryOrderItem[];
};

const OrdersExpiryTable: React.FC<Props> = ({ colors, items }) => (
  <div
    className="rounded-xl shadow-sm border overflow-hidden transition-colors duration-200"
    style={{
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.primary,
    }}
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b transition-colors duration-200">
          <tr>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Order
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Customer
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Product
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Plan
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Ordered
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Expired On
            </th>
            <th className="text-center py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y transition-colors duration-200">
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center" style={{ color: colors.text.secondary }}>
                No expired orders found
              </td>
            </tr>
          ) : (
            items.map(({ order, item, expiresAt, planLabel }) => {
              const hasWhatsappPhone = Boolean(
                normalizeWhatsAppPhone(displayOrderCustomerPhone(order)),
              );
              const handleWhatsAppClick = () => {
                const whatsappUrl = buildExpiryWhatsAppUrl(order, item, expiresAt);
                if (!whatsappUrl) return;
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              };

              return (
                <tr
                  key={`${order.orderId || order._id}-${item.productId || item.name}`}
                  className="transition-colors duration-200"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="py-4 px-4 font-medium" style={{ color: colors.interactive.primary }}>
                    {order.orderNumber ? `#${order.orderNumber}` : order.orderId || order._id || "—"}
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
                      {item.name}
                    </div>
                  </td>
                  <td className="py-4 px-4" style={{ color: colors.text.primary }}>
                    {planLabel || "—"}
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
                  <td className="py-4 px-4" style={{ color: colors.text.secondary }}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {expiresAt.toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleWhatsAppClick}
                        disabled={!hasWhatsappPhone}
                        className="p-2 rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: colors.background.accent,
                          color: "#25D366",
                        }}
                        onMouseEnter={(e) => {
                          if (hasWhatsappPhone) {
                            e.currentTarget.style.backgroundColor = "#25D366";
                            e.currentTarget.style.color = "#ffffff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.background.accent;
                          e.currentTarget.style.color = "#25D366";
                        }}
                        title={
                          hasWhatsappPhone
                            ? "Send expiry WhatsApp message"
                            : "Customer phone number unavailable"
                        }
                        aria-label={
                          hasWhatsappPhone
                            ? "Send expiry WhatsApp message"
                            : "Customer phone number unavailable"
                        }
                      >
                        <FaWhatsapp className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersExpiryTable;
