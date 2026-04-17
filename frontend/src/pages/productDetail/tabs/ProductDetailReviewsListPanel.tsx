import { getDisplayedProductReviews } from "./getDisplayedProductReviews";
import { ProductDetailReviewCard } from "./ProductDetailReviewCard";
import type { ProductDetailReviewsTabProps } from "./tabTypes";

export function ProductDetailReviewsListPanel(
  props: ProductDetailReviewsTabProps
) {
  const {
    colors,
    reviews,
    reviewsLoading,
    ratingFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortBy,
    showAllReviews,
    setShowAllReviews,
    reviewsInitialCount,
  } = props;

  if (reviewsLoading) {
    return (
      <div className="text-center py-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
          style={{ borderColor: colors.interactive.primary }}
        />
        <p className="mt-2 text-sm" style={{ color: colors.text.secondary }}>
          Loading reviews...
        </p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div
        className="rounded-xl p-12 text-center border"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <p style={{ color: colors.text.secondary }}>
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    );
  }

  const { displayed, shouldCollapse } = getDisplayedProductReviews(reviews, {
    ratingFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortBy,
    showAllReviews,
    initialCount: reviewsInitialCount,
  });

  return (
    <>
      {displayed.map((review) => (
        <ProductDetailReviewCard key={review._id} review={review} {...props} />
      ))}
      {shouldCollapse && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="text-sm font-medium cursor-pointer bg-transparent border-0 p-0 transition-opacity hover:opacity-80"
            style={{ color: colors.interactive.primary }}
          >
            {showAllReviews ? "See less reviews..." : "See more reviews..."}
          </button>
        </div>
      )}
    </>
  );
}
