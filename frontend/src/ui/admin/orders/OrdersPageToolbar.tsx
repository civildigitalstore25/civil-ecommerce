import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { ExportRangeType } from "./adminOrderUtils";
import OrdersExportRangeFields from "./OrdersExportRangeFields";
import OrdersExportMenu from "./OrdersExportMenu";

type Props = {
  colors: ThemeColors;
  showCreateForm: boolean;
  onToggleCreate: () => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  exportOpen: boolean;
  setExportOpen: (v: boolean) => void;
  exportRangeType: ExportRangeType;
  setExportRangeType: (v: ExportRangeType) => void;
  exportDate: string;
  setExportDate: (v: string) => void;
  exportWeek: string;
  setExportWeek: (v: string) => void;
  exportMonth: string;
  setExportMonth: (v: string) => void;
  exportYear: string;
  setExportYear: (v: string) => void;
  exportCustomFromDate: string;
  setExportCustomFromDate: (v: string) => void;
  exportCustomToDate: string;
  setExportCustomToDate: (v: string) => void;
  onExportExcel: () => void;
  onExportJSON: () => void;
};

const OrdersPageToolbar: React.FC<Props> = (props) => (
  <div className="flex justify-between items-center flex-wrap gap-4">
    <h2 className="text-2xl font-bold" style={{ color: props.colors.text.primary }}>
      Orders Management
    </h2>
    <div className="flex items-center space-x-3 flex-wrap">
      <button
        type="button"
        className="px-4 py-2 rounded-lg font-medium"
        style={{ background: "#0068ff", color: "#fff" }}
        onClick={props.onToggleCreate}
      >
        {props.showCreateForm ? "Close" : "Create Order"}
      </button>

      <OrdersExportRangeFields
        colors={props.colors}
        exportRangeType={props.exportRangeType}
        setExportRangeType={props.setExportRangeType}
        exportDate={props.exportDate}
        setExportDate={props.setExportDate}
        exportWeek={props.exportWeek}
        setExportWeek={props.setExportWeek}
        exportMonth={props.exportMonth}
        setExportMonth={props.setExportMonth}
        exportYear={props.exportYear}
        setExportYear={props.setExportYear}
        exportCustomFromDate={props.exportCustomFromDate}
        setExportCustomFromDate={props.setExportCustomFromDate}
        exportCustomToDate={props.exportCustomToDate}
        setExportCustomToDate={props.setExportCustomToDate}
      />

      <OrdersExportMenu
        colors={props.colors}
        exportOpen={props.exportOpen}
        setExportOpen={props.setExportOpen}
        onExportExcel={props.onExportExcel}
        onExportJSON={props.onExportJSON}
      />

      <select
        className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
        style={{
          backgroundColor: props.colors.background.secondary,
          borderColor: props.colors.border.primary,
          color: props.colors.text.primary,
        }}
        value={props.statusFilter}
        onChange={(e) => props.onStatusFilterChange(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="processing">Processing</option>
        <option value="delivered">Success</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  </div>
);

export default OrdersPageToolbar;
