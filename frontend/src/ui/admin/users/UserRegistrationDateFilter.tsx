import React from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  customStartDate: string;
  onCustomStartChange: (value: string) => void;
  customEndDate: string;
  onCustomEndChange: (value: string) => void;
};

const UserRegistrationDateFilter: React.FC<Props> = ({
  colors,
  dateFilter,
  onDateFilterChange,
  customStartDate,
  onCustomStartChange,
  customEndDate,
  onCustomEndChange,
}) => (
  <div
    className="rounded-lg p-4 border"
    style={{
      background: colors.background.primary,
      borderColor: colors.border.primary,
    }}
  >
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
          Filter by Registration Date
        </label>
        <select
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="last-week">Last Week</option>
          <option value="last-month">Last Month</option>
          <option value="last-year">Last Year</option>
          <option value="custom">Custom Date Range</option>
        </select>
      </div>

      {dateFilter === "custom" && (
        <>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
              Start Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              value={customStartDate}
              onChange={(e) => onCustomStartChange(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
              End Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              value={customEndDate}
              onChange={(e) => onCustomEndChange(e.target.value)}
            />
          </div>
        </>
      )}
    </div>
  </div>
);

export default UserRegistrationDateFilter;
