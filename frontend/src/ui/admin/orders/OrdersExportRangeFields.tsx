import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { ExportRangeType } from "./adminOrderUtils";

const inputStyle = (colors: ThemeColors) => ({
  backgroundColor: colors.background.secondary,
  borderColor: colors.border.primary,
  color: colors.text.primary,
});

type Props = {
  colors: ThemeColors;
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
};

const OrdersExportRangeFields: React.FC<Props> = ({
  colors,
  exportRangeType,
  setExportRangeType,
  exportDate,
  setExportDate,
  exportWeek,
  setExportWeek,
  exportMonth,
  setExportMonth,
  exportYear,
  setExportYear,
  exportCustomFromDate,
  setExportCustomFromDate,
  exportCustomToDate,
  setExportCustomToDate,
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <select
      className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
      style={inputStyle(colors)}
      value={exportRangeType}
      onChange={(e) => setExportRangeType(e.target.value as ExportRangeType)}
      title="Export date filter"
    >
      <option value="all">All Dates</option>
      <option value="date">Date Wise</option>
      <option value="week">Week Wise</option>
      <option value="month">Month Wise</option>
      <option value="year">Year Wise</option>
      <option value="custom">From - To</option>
    </select>

    {exportRangeType === "date" && (
      <input
        type="date"
        className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
        style={inputStyle(colors)}
        value={exportDate}
        onChange={(e) => setExportDate(e.target.value)}
      />
    )}

    {exportRangeType === "week" && (
      <input
        type="week"
        className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
        style={inputStyle(colors)}
        value={exportWeek}
        onChange={(e) => setExportWeek(e.target.value)}
      />
    )}

    {exportRangeType === "month" && (
      <input
        type="month"
        className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
        style={inputStyle(colors)}
        value={exportMonth}
        onChange={(e) => setExportMonth(e.target.value)}
      />
    )}

    {exportRangeType === "year" && (
      <input
        type="number"
        min={1970}
        max={9999}
        className="border rounded-lg px-3 py-2 w-28 focus:ring-2 transition-colors duration-200"
        style={inputStyle(colors)}
        value={exportYear}
        onChange={(e) => setExportYear(e.target.value)}
        placeholder="YYYY"
      />
    )}

    {exportRangeType === "custom" && (
      <>
        <input
          type="date"
          className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
          style={inputStyle(colors)}
          value={exportCustomFromDate}
          onChange={(e) => setExportCustomFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
          style={inputStyle(colors)}
          value={exportCustomToDate}
          onChange={(e) => setExportCustomToDate(e.target.value)}
        />
      </>
    )}
  </div>
);

export default OrdersExportRangeFields;
