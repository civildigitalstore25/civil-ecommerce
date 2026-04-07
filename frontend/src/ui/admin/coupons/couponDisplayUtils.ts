import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Coupon } from "./types";

export function formatCouponDate(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isCouponExpired(validTo: string): boolean {
  return new Date(validTo) < new Date();
}

export function getCouponStatusColor(
  coupon: Coupon,
  colors: ThemeColors,
): { bg: string; text: string } {
  if (coupon.status === "Inactive") {
    return { bg: colors.status.warning, text: colors.text.primary };
  }
  if (isCouponExpired(coupon.validTo)) {
    return { bg: colors.status.error, text: colors.text.inverse };
  }
  return { bg: colors.interactive.primary, text: colors.text.primary };
}

export function getCouponStatusText(coupon: Coupon): string {
  if (coupon.status === "Inactive") return "INACTIVE";
  if (isCouponExpired(coupon.validTo)) return "EXPIRED";
  return "ACTIVE";
}

export function formatApplicableProductNames(
  ids: Coupon["applicableProductIds"],
): string {
  if (!ids?.length) return "";
  return ids
    .map((p) => {
      if (typeof p === "object" && p !== null) {
        if ("name" in p && p.name) return p.name;
        if ("_id" in p) return String((p as { _id: string })._id);
      }
      return String(p);
    })
    .join(", ");
}
