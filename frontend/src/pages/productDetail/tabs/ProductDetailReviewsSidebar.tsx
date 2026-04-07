import * as LucideIcons from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ReviewStats } from "../../../api/reviewApi";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { isAuthenticated } from "../../../utils/auth";

type ProductDetailReviewsSidebarProps = {
  colors: ThemeColors;
  reviewStats: ReviewStats;
  user: { id?: string; role?: string; fullName?: string } | null | undefined;
  showReviewForm: boolean;
  navigate: NavigateFunction;
  handleWriteReviewClick: () => void;
};

export function ProductDetailReviewsSidebar({
  colors,
  reviewStats,
  user,
  showReviewForm,
  navigate,
  handleWriteReviewClick,
}: ProductDetailReviewsSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div
        className="rounded-xl p-6 transition-colors duration-200 border"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <h4
          className="text-lg font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Customer Ratings
        </h4>

        <div className="text-center mb-4">
          <div className="flex justify-center text-yellow-400 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <LucideIcons.Star
                key={i}
                size={24}
                fill={
                  i < Math.round(reviewStats.averageRating)
                    ? "currentColor"
                    : "none"
                }
              />
            ))}
          </div>
          <div
            className="text-3xl font-bold"
            style={{ color: colors.text.primary }}
          >
            {reviewStats.averageRating.toFixed(1)} out of 5
          </div>
        </div>

        <div className="text-sm mb-4" style={{ color: colors.text.secondary }}>
          {reviewStats.totalReviews} Customer rating
          {reviewStats.totalReviews !== 1 ? "s" : ""}
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              reviewStats.ratingDistribution[
                star as keyof typeof reviewStats.ratingDistribution
              ];
            const pct =
              reviewStats.totalReviews > 0
                ? (count / reviewStats.totalReviews) * 100
                : 0;

            return (
              <div key={star} className="flex items-center gap-2">
                <span
                  className="text-sm w-14"
                  style={{ color: colors.text.secondary }}
                >
                  {star} Stars
                </span>
                <div
                  className="flex-1 rounded-full h-2 overflow-hidden"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "#10b981",
                    }}
                  />
                </div>
                <span
                  className="text-sm w-8 text-right font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  {pct.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>

        {!showReviewForm && (
          <div className="mt-6">
            {user || isAuthenticated() ? (
              <button
                type="button"
                onClick={handleWriteReviewClick}
                className="w-full font-medium py-2.5 rounded-lg text-sm transition-all duration-200 border"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.interactive.primary,
                  borderColor: colors.interactive.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.interactive.primary;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.primary;
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
              >
                Write a review
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="w-full font-medium py-2.5 rounded-lg text-sm transition-all duration-200 border"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.interactive.primary,
                  borderColor: colors.interactive.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.interactive.primary;
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.background.primary;
                  e.currentTarget.style.color = colors.interactive.primary;
                }}
              >
                Login to Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
