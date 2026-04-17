import React from "react";
import { ShoppingCart, Hourglass, Clock, CheckCircle, XCircle } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  totalOrdersCount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
  cancelledCount: number;
};

const OrdersStatsGrid: React.FC<Props> = ({
  colors,
  totalOrdersCount,
  pendingCount,
  processingCount,
  completedCount,
  cancelledCount,
}) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
    <div
      className="rounded-xl p-5 shadow-sm border transition-colors duration-200 min-w-0"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: colors.text.secondary }}>
            Total Orders
          </p>
          <h3 className="text-3xl font-bold mt-1" style={{ color: colors.text.primary }}>
            {totalOrdersCount}
          </h3>
        </div>
        <ShoppingCart
          className="w-10 h-10 shrink-0"
          style={{ color: colors.text.primary, opacity: 0.2 }}
        />
      </div>
    </div>
    <div
      className="rounded-xl p-5 shadow-sm border transition-colors duration-200 min-w-0"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: colors.text.secondary }}>
            Pending
          </p>
          <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.info }}>
            {pendingCount}
          </h3>
        </div>
        <Hourglass
          className="w-10 h-10 shrink-0"
          style={{ color: colors.status.info, opacity: 0.25 }}
        />
      </div>
    </div>
    <div
      className="rounded-xl p-5 shadow-sm border transition-colors duration-200 min-w-0"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: colors.text.secondary }}>
            Processing
          </p>
          <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.warning }}>
            {processingCount}
          </h3>
        </div>
        <Clock
          className="w-10 h-10 shrink-0"
          style={{ color: colors.status.warning, opacity: 0.25 }}
        />
      </div>
    </div>
    <div
      className="rounded-xl p-5 shadow-sm border transition-colors duration-200 min-w-0"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: colors.text.secondary }}>
            Success
          </p>
          <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.success }}>
            {completedCount}
          </h3>
        </div>
        <CheckCircle
          className="w-10 h-10 shrink-0"
          style={{ color: colors.status.success, opacity: 0.2 }}
        />
      </div>
    </div>
    <div
      className="rounded-xl p-5 shadow-sm border transition-colors duration-200 min-w-0"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm truncate" style={{ color: colors.text.secondary }}>
            Cancelled
          </p>
          <h3 className="text-3xl font-bold mt-1" style={{ color: colors.status.error }}>
            {cancelledCount}
          </h3>
        </div>
        <XCircle
          className="w-10 h-10 shrink-0"
          style={{ color: colors.status.error, opacity: 0.2 }}
        />
      </div>
    </div>
  </div>
);

export default OrdersStatsGrid;
