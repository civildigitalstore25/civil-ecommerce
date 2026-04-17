import React from "react";

type Props = {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  mutedStarColor: string;
};

const ReviewStarRating: React.FC<Props> = ({
  rating,
  interactive = false,
  onRatingChange,
  mutedStarColor,
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(star)}
        className={`text-lg ${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
        style={{
          color: star <= rating ? "#fbbf24" : mutedStarColor,
        }}
      >
        ★
      </button>
    ))}
  </div>
);

export default ReviewStarRating;
