import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { HomeReviewCard } from "./reviews/HomeReviewCard";
import { ReviewsMarqueeKeyframes } from "./reviews/ReviewsMarqueeKeyframes";
import { reviewsSectionGradientStyle } from "./reviews/reviewsSectionSurfaceStyle";
import { useHomeReviewsSection } from "./reviews/useHomeReviewsSection";

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const { reviews, isLoading } = useHomeReviewsSection();
  const surfaceStyle = reviewsSectionGradientStyle(colors);

  if (isLoading) {
    return (
      <section
        id="reviews-section"
        className="w-full py-16 transition-colors duration-200"
        style={surfaceStyle}
      >
        <div className="text-center px-4">
          <div style={{ color: colors.text.secondary }}>Loading reviews...</div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const allReviews = [...reviews, ...reviews];

  return (
    <section
      id="reviews-section"
      className="w-full py-16 transition-colors duration-200 overflow-hidden"
      style={surfaceStyle}
    >
      <ReviewsMarqueeKeyframes reviewCount={reviews.length} />

      <div className="text-center mb-8 md:mb-12 px-4">
        <h2
          className="text-2xl md:text-4xl font-poppins font-bold transition-colors duration-200 mb-2"
          style={{
            color: colors.text.primary,
            textShadow: `0 2px 8px ${colors.background.primary}80`,
          }}
        >
          What Our Customers Say
        </h2>
      </div>

      <div
        className="md:hidden w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
      >
        <div className="flex gap-4">
          {reviews.map((review) => (
            <HomeReviewCard
              key={review._id}
              review={review}
              colors={colors}
              variant="mobile"
            />
          ))}
        </div>
      </div>

      <div className="hidden md:block reviews-track w-full">
        <div className="flex animate-scroll-reviews gap-6">
          {allReviews.map((review, index) => (
            <HomeReviewCard
              key={`${review._id}-${index}`}
              review={review}
              colors={colors}
              variant="desktop"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
