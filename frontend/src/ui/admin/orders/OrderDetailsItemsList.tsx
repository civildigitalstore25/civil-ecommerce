import React from "react";
import { Package } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

export type DetailLineItem = {
  name: string;
  productId?: string;
  quantity: number;
  price: number;
  image?: string;
  version?: string;
  pricingPlan?: string;
};

type Props = {
  colors: ThemeColors;
  items: DetailLineItem[];
};

const OrderDetailsItemsList: React.FC<Props> = ({ colors, items }) => (
  <div className="p-5 rounded-lg border" style={{ backgroundColor: "#fff", borderColor: "#000" }}>
    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: "#000" }}>
      <Package className="w-5 h-5" />
      Ordered Products ({items.length} items)
    </h4>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={`${item.productId ?? item.name}-${index}`}
          className="flex items-start gap-4 p-4 rounded-lg"
          style={{ backgroundColor: "#fff" }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base mb-2" style={{ color: "#000" }}>
              {item.name}
            </p>
            <div className="mt-2 space-y-1.5">
              <p className="text-xs" style={{ color: "#6b7280" }}>
                <span className="font-medium" style={{ color: "#000" }}>
                  Product ID:
                </span>{" "}
                {item.productId}
              </p>
              {item.version ? (
                <p className="text-sm flex items-center gap-2" style={{ color: "#6b7280" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Version:
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: "#e5e7eb", color: "#000" }}
                  >
                    {item.version}
                  </span>
                </p>
              ) : (
                <p className="text-xs" style={{ color: "#000" }}>
                  <span className="font-medium">Version:</span>{" "}
                  <span style={{ opacity: 0.6 }}>Not specified</span>
                </p>
              )}
              {item.pricingPlan ? (
                <p className="text-sm flex items-center gap-2" style={{ color: "#6b7280" }}>
                  <span className="font-medium" style={{ color: "#000" }}>
                    Plan:
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                    style={{
                      backgroundColor: colors.background.accent,
                      color: colors.interactive.primary,
                    }}
                  >
                    {item.pricingPlan}
                  </span>
                </p>
              ) : (
                <p className="text-xs" style={{ color: colors.text.secondary }}>
                  <span className="font-medium" style={{ color: colors.text.primary }}>
                    Plan:
                  </span>{" "}
                  <span style={{ opacity: 0.6 }}>Not specified</span>
                </p>
              )}
              <p
                className="text-sm mt-2 pt-2"
                style={{
                  color: "#6b7280",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span className="font-medium" style={{ color: "#000" }}>
                  Quantity:
                </span>{" "}
                {item.quantity} × ₹{item.price.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-lg" style={{ color: "#000" }}>
              ₹{(item.quantity * item.price).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default OrderDetailsItemsList;
