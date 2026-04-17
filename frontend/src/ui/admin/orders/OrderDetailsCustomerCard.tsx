import React from "react";
import { User, Phone, Mail } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderLike } from "./adminOrderUtils";
import { displayOrderCustomerEmail, displayOrderCustomerPhone } from "./adminOrderUtils";

type Props = {
  colors: ThemeColors;
  order: AdminOrderLike;
};

const OrderDetailsCustomerCard: React.FC<Props> = ({ colors, order }) => (
  <div className="p-5 rounded-lg border" style={{ backgroundColor: "#fff", borderColor: "#000" }}>
    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#000" }}>
      <User className="w-5 h-5" />
      Customer Information
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-start gap-3">
        <User className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
        <div>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Name
          </p>
          <p className="font-medium" style={{ color: "#000" }}>
            {order.shippingAddress?.fullName || order.userId?.fullName || "N/A"}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Phone className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
        <div>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Phone
          </p>
          <p className="font-medium" style={{ color: "#000" }}>
            {displayOrderCustomerPhone(order) || "N/A"}
          </p>
        </div>
      </div>
      {displayOrderCustomerEmail(order) && (
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 mt-0.5" style={{ color: colors.text.secondary }} />
          <div>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              Email
            </p>
            <p className="font-medium" style={{ color: "#000" }}>
              {displayOrderCustomerEmail(order)}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default OrderDetailsCustomerCard;
