import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Coupon } from "./types";
import { isCouponExpired } from "./couponDisplayUtils";

type Props = {
  colors: ThemeColors;
  coupons: Coupon[];
};

const CouponsStats: React.FC<Props> = ({ colors, coupons }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Total Coupons
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: colors.text.primary }}>
        {coupons.length}
      </p>
    </div>
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Active Coupons
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: colors.status.success }}>
        {coupons.filter((c) => c.status === "Active" && !isCouponExpired(c.validTo)).length}
      </p>
    </div>
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Expired Coupons
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: colors.status.error }}>
        {coupons.filter((c) => isCouponExpired(c.validTo)).length}
      </p>
    </div>
  </div>
);

export default CouponsStats;
