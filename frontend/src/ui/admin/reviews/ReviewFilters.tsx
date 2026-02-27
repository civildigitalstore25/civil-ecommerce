import React from "react";
import { MessageSquare } from "lucide-react";
import AdminSearchBar from "../components/AdminSearchBar";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface ReviewFiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  ratingFilter: string;
  setRatingFilter: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  clearFilters: () => void;
  totalReviews: number;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  ratingFilter,
  setRatingFilter,
  dateFilter,
  setDateFilter,
  clearFilters,
  totalReviews,
}) => {
  const { colors } = useAdminTheme();

  const hasActiveFilters = searchTerm || ratingFilter || dateFilter !== "all";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
        <AdminSearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by user, product, comment..."
        />

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-36 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-40 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option value="all">All Time</option>
          <option value="last-week">Last Week</option>
          <option value="last-month">Last Month</option>
          <option value="last-year">Last Year</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm transition-colors duration-200"
            style={{ color: colors.interactive.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = (colors as any).interactive?.primaryHover || colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.interactive.primary;
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div
        className="flex items-center space-x-2 text-sm"
        style={{ color: colors.text.secondary }}
      >
        <MessageSquare className="w-4 h-4" />
        <span>{totalReviews} reviews total</span>
      </div>
    </div>
  );
};

export default ReviewFilters;
