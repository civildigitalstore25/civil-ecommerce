import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AdminOrderLike } from "./adminOrderUtils";
import OrderTableRow from "./OrderTableRow";

type Props = {
  colors: ThemeColors;
  filteredOrders: AdminOrderLike[];
  paginatedOrders: AdminOrderLike[];
  selectedOrders: string[];
  onSelectAll: () => void;
  onSelectOrder: (id: string) => void;
  onViewDetails: (order: AdminOrderLike) => void;
  onDeleteOrder: (order: AdminOrderLike) => void;
  deletePending: boolean;
};

const OrdersDataTable: React.FC<Props> = ({
  colors,
  filteredOrders,
  paginatedOrders,
  selectedOrders,
  onSelectAll,
  onSelectOrder,
  onViewDetails,
  onDeleteOrder,
  deletePending,
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
            <th className="text-center py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              <input
                type="checkbox"
                checked={
                  selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0
                }
                onChange={onSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Order ID
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Customer
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Product
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Amount
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Date
            </th>
            <th className="text-center py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y transition-colors duration-200">
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center" style={{ color: colors.text.secondary }}>
                No orders found
              </td>
            </tr>
          ) : (
            paginatedOrders.map((order) => (
              <OrderTableRow
                key={order._id}
                colors={colors}
                order={order}
                selectedOrders={selectedOrders}
                onSelectOrder={onSelectOrder}
                onViewDetails={onViewDetails}
                onDeleteOrder={onDeleteOrder}
                deletePending={deletePending}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default OrdersDataTable;
