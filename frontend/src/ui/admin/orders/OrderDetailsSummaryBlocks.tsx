import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  subtotal: number;
  discount: number;
  shippingCharges: number;
  totalAmount: number;
  notes?: string;
  cashfreePaymentId?: string;
  cashfreeOrderId?: string;
};

const OrderDetailsSummaryBlocks: React.FC<Props> = ({
  colors,
  subtotal,
  discount,
  shippingCharges,
  totalAmount,
  notes,
  cashfreePaymentId,
  cashfreeOrderId,
}) => (
  <>
    <div className="p-5 rounded-lg border">
      <h4 className="text-lg font-semibold mb-4" style={{ color: "#000" }}>
        Order Summary
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span style={{ color: "#000" }}>Subtotal</span>
          <span style={{ color: "#000" }}>₹{subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span style={{ color: "#000" }}>Discount</span>
            <span style={{ color: colors.status.success }}>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        {shippingCharges > 0 && (
          <div className="flex justify-between">
            <span style={{ color: "#000" }}>Shipping</span>
            <span style={{ color: "#000" }}>₹{shippingCharges.toLocaleString()}</span>
          </div>
        )}
        <div
          className="flex justify-between pt-3 border-t text-lg font-bold"
          style={{ borderTopColor: "#e5e7eb" }}
        >
          <span style={{ color: "#000" }}>Total Amount</span>
          <span style={{ color: colors.interactive.primary }}>₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>

    {notes && (
      <div className="p-5 rounded-lg border">
        <h4 className="text-lg font-semibold mb-2" style={{ color: "#000" }}>
          Notes
        </h4>
        <p style={{ color: "#000" }}>{notes}</p>
      </div>
    )}

    {cashfreePaymentId && (
      <div className="p-5 rounded-lg border">
        <h4 className="text-lg font-semibold mb-3" style={{ color: "#000" }}>
          Payment Details
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#000" }}>Payment ID</span>
            <span className="font-mono" style={{ color: "#000" }}>
              {cashfreePaymentId}
            </span>
          </div>
          {cashfreeOrderId && (
            <div className="flex justify-between">
              <span style={{ color: "#000" }}>Cashfree Order ID</span>
              <span className="font-mono" style={{ color: "#000" }}>
                {cashfreeOrderId}
              </span>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

export default OrderDetailsSummaryBlocks;
