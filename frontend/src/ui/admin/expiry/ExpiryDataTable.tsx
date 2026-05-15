import React from "react";
import { MessageCircle, Eye } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { ExpiredProduct } from "../../../api/adminExpiryApi";
import { openWhatsAppForExpiry } from "../../../utils/whatsappUtils";

type Props = {
  colors: ThemeColors;
  expiredProducts: ExpiredProduct[];
  paginatedProducts: ExpiredProduct[];
  selectedProducts: string[];
  onSelectAll: () => void;
  onSelectProduct: (id: string) => void;
  onViewDetails?: (product: ExpiredProduct) => void;
};

const ExpiryDataTable: React.FC<Props> = ({
  colors,
  expiredProducts,
  paginatedProducts,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onViewDetails,
}) => (
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
            <th
              className="text-center py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              <input
                type="checkbox"
                checked={
                  selectedProducts.length === paginatedProducts.length &&
                  paginatedProducts.length > 0
                }
                onChange={onSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Order ID
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Customer
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Product
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              License Type
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Expired On
            </th>
            <th
              className="text-left py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Days Expired
            </th>
            <th
              className="text-center py-3 px-4 font-medium"
              style={{ color: colors.text.primary }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y transition-colors duration-200">
          {expiredProducts.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-8 text-center"
                style={{ color: colors.text.secondary }}
              >
                No expired products found
              </td>
            </tr>
          ) : (
            paginatedProducts.map((product) => (
              <tr
                key={product._id}
                className="hover:transition-colors duration-200"
                style={{
                  backgroundColor: selectedProducts.includes(product._id)
                    ? `${colors.text.accent}20`
                    : "transparent",
                }}
              >
                <td className="text-center py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => onSelectProduct(product._id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
                <td
                  className="py-3 px-4 font-mono text-sm"
                  style={{ color: colors.text.primary }}
                >
                  {product.orderId}
                </td>
                <td className="py-3 px-4" style={{ color: colors.text.primary }}>
                  <div className="font-medium">{product.customerName}</div>
                  <div className="text-sm" style={{ color: colors.text.secondary }}>
                    {product.customerEmail}
                  </div>
                </td>
                <td className="py-3 px-4" style={{ color: colors.text.primary }}>
                  {product.productName}
                </td>
                <td className="py-3 px-4" style={{ color: colors.text.primary }}>
                  <span
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${colors.text.accent}20`,
                      color: colors.text.accent,
                    }}
                  >
                    {product.licenseType === "1year"
                      ? "1 Year"
                      : product.licenseType === "3year"
                        ? "3 Year"
                        : product.licenseType === "5minute"
                          ? "5 Minute"
                        : product.licenseType}
                  </span>
                </td>
                <td className="py-3 px-4" style={{ color: colors.text.primary }}>
                  {product.expiryDateDisplay}
                </td>
                <td
                  className="py-3 px-4 font-medium text-red-600"
                  style={{ color: "#ef4444" }}
                >
                  {product.daysSinceExpiry} days
                </td>
                <td className="text-center py-3 px-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        openWhatsAppForExpiry(
                          product.customerPhone,
                          product.productName,
                          product.licenseExpiryDate
                        )
                      }
                      className="p-2 rounded hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: `${colors.text.accent}20`, color: colors.text.accent }}
                      title="Send WhatsApp message"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {onViewDetails && (
                      <button
                        onClick={() => onViewDetails(product)}
                        className="p-2 rounded hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: `${colors.text.accent}20`, color: colors.text.accent }}
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default ExpiryDataTable;
