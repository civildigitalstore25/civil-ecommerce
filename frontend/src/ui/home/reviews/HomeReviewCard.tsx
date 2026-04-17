import { Star } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { Review as ApiReview } from "../../../api/reviewApi";
import {
  buildReviewInitialsAvatarUrl,
  formatReviewTimeAgo,
} from "./reviewDisplayUtils";

type HomeReviewCardProps = {
  review: ApiReview;
  colors: ThemeColors;
  variant: "mobile" | "desktop";
};

export function HomeReviewCard({
  review,
  colors,
  variant,
}: HomeReviewCardProps) {
  const displayName =
    review.user?.fullName || review.anonymousName || "Anonymous";
  const avatarSrc = buildReviewInitialsAvatarUrl(
    displayName,
    colors.interactive.primary || "#3B82F6",
  );

  const shellClass =
    variant === "mobile"
      ? "flex-shrink-0 snap-start w-[300px] rounded-2xl shadow-md p-5 flex flex-col justify-between transition-all duration-300"
      : "flex-shrink-0 w-80 md:w-96 rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105";

  return (
    <div className={shellClass} style={{ backgroundColor: colors.background.primary }}>
      <div className="flex justify-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>

      <p
        className="italic mb-4 font-lato transition-colors duration-200 line-clamp-4 text-center"
        style={{ color: colors.text.secondary }}
      >
        &quot;{review.comment}&quot;
      </p>

      <div className="flex items-center justify-center space-x-4">
        <div
          className="w-12 h-12 rounded-full border-2 transition-colors duration-200 overflow-hidden flex-shrink-0"
          style={{ borderColor: colors.interactive.primary }}
        >
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4
            className="font-poppins font-semibold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {displayName}
          </h4>
          <p
            className="text-sm font-lato transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {formatReviewTimeAgo(review.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
