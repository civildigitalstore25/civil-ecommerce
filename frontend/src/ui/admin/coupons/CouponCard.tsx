import React from "react";
import { Calendar, Users, Package, Pencil, Trash2 } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Coupon } from "./types";
import {
  formatApplicableProductNames,
  formatCouponDate,
  getCouponStatusColor,
  getCouponStatusText,
} from "./couponDisplayUtils";

type Props = {
  coupon: Coupon;
  colors: ThemeColors;
  onEdit: (coupon: Coupon) => void;
  onDelete: (coupon: Coupon) => void;
};

const CouponCard: React.FC<Props> = ({ coupon, colors, onEdit, onDelete }) => {
  const statusColor = getCouponStatusColor(coupon, colors);
  const statusText = getCouponStatusText(coupon);
  const discountDisplay =
    coupon.discountType === "Percentage"
      ? `${coupon.discountValue}% OFF`
      : `$${coupon.discountValue} OFF`;

  return (
    <div
      className="rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.interactive.primary,
        borderWidth: "1px",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
            style={{
              backgroundColor: colors.interactive.primary + "20",
              color: colors.interactive.primary,
              borderColor: colors.interactive.primary + "40",
            }}
          >
            {coupon.code}
          </span>
          <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
            {coupon.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#fbbf24", color: "#111827" }}
          >
            {discountDisplay}
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: statusColor.bg,
              color: statusColor.text,
            }}
          >
            {statusText}
          </span>
          {coupon.applicableProductIds && coupon.applicableProductIds.length > 0 && (
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: colors.text.secondary + "30",
                color: colors.text.primary,
              }}
            >
              Product-specific
            </span>
          )}
        </div>
      </div>

      {coupon.description && (
        <p className="text-sm mb-3" style={{ color: colors.text.primary }}>
          {coupon.description}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} style={{ color: colors.text.secondary }} />
          <span className="text-sm" style={{ color: colors.text.secondary }}>
            Valid: {formatCouponDate(coupon.validFrom)} - {formatCouponDate(coupon.validTo)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users
            size={16}
            style={{
              color:
                coupon.usedCount >= coupon.usageLimit
                  ? colors.status.error
                  : colors.text.secondary,
            }}
          />
          <span
            className="text-sm font-semibold"
            style={{
              color:
                coupon.usedCount >= coupon.usageLimit
                  ? colors.status.error
                  : colors.text.secondary,
            }}
          >
            {coupon.usedCount}/{coupon.usageLimit} used
            {coupon.usedCount >= coupon.usageLimit && " 🚫"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Package size={16} style={{ color: colors.text.secondary }} />
          <span className="text-sm" style={{ color: colors.text.secondary }}>
            {coupon.discountType}
          </span>
        </div>
      </div>

      {coupon.applicableProductIds && coupon.applicableProductIds.length > 0 && (
        <div
          className="mb-3 p-2 rounded text-sm"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.secondary,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          <span className="font-medium" style={{ color: colors.text.primary }}>
            Applicable to:{" "}
          </span>
          {formatApplicableProductNames(coupon.applicableProductIds)}
        </div>
      )}

      {coupon.usedCount >= coupon.usageLimit && (
        <div
          className="mb-3 p-2 rounded text-sm"
          style={{
            backgroundColor: colors.status.error + "20",
            color: colors.status.error,
            border: `1px solid ${colors.status.error}`,
          }}
        >
          ⚠️ Usage limit reached - This coupon will auto-deactivate on next use
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => onEdit(coupon)}
          className="p-2 rounded-full border hover:opacity-80 transition"
          style={{
            backgroundColor: "transparent",
            color: colors.interactive.primary,
            borderColor: colors.interactive.primary,
            borderWidth: "1px",
          }}
          title="Edit coupon"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(coupon)}
          className="p-2 rounded-full border hover:opacity-80 transition"
          style={{
            backgroundColor: "transparent",
            color: colors.status.error,
            borderColor: colors.status.error,
            borderWidth: "1px",
          }}
          title="Delete coupon"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
