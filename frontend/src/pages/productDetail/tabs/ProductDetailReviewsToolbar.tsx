import {
  REVIEW_DATE_FILTERS,
  REVIEW_RATING_FILTERS,
  REVIEW_SORT_OPTIONS,
} from "../../../constants/reviewConstants";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { ReviewStats } from "../../../api/reviewApi";

type ProductDetailReviewsToolbarProps = {
  colors: ThemeColors;
  reviewStats: ReviewStats;
  reviewsLength: number;
  sortBy: string;
  setSortBy: (v: string) => void;
  ratingFilter: string;
  setRatingFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: string) => void;
};

export function ProductDetailReviewsToolbar({
  colors,
  reviewStats,
  reviewsLength,
  sortBy,
  setSortBy,
  ratingFilter,
  setRatingFilter,
  dateFilter,
  setDateFilter,
}: ProductDetailReviewsToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h3
        className="text-2xl font-bold"
        style={{ color: colors.text.primary }}
      >
        Customer Reviews ({reviewStats.totalReviews})
      </h3>

      {reviewsLength > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: colors.text.secondary }}>
              Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.interactive.primary,
              }}
            >
              {REVIEW_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: colors.text.secondary }}>
              Ratings
            </span>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.interactive.primary,
              }}
            >
              {REVIEW_RATING_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: colors.text.secondary }}>
              Date
            </span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.interactive.primary,
              }}
            >
              {REVIEW_DATE_FILTERS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
