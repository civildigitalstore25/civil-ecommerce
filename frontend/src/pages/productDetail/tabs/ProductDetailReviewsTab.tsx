import { ProductDetailReviewsCustomDateRow } from "./ProductDetailReviewsCustomDateRow";
import { ProductDetailReviewsForm } from "./ProductDetailReviewsForm";
import { ProductDetailReviewsListPanel } from "./ProductDetailReviewsListPanel";
import { ProductDetailReviewsSidebar } from "./ProductDetailReviewsSidebar";
import { ProductDetailReviewsToolbar } from "./ProductDetailReviewsToolbar";
import type { ProductDetailReviewsTabProps } from "./tabTypes";

export function ProductDetailReviewsTab(props: ProductDetailReviewsTabProps) {
  const {
    colors,
    reviewStats,
    reviews,
    sortBy,
    setSortBy,
    ratingFilter,
    setRatingFilter,
    dateFilter,
    setDateFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    user,
    navigate,
    showReviewForm,
    handleWriteReviewClick,
  } = props;

  return (
    <div>
      {reviewStats && (
        <>
          <ProductDetailReviewsToolbar
            colors={colors}
            reviewStats={reviewStats}
            reviewsLength={reviews.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          <ProductDetailReviewsCustomDateRow
            colors={colors}
            reviewsLength={reviews.length}
            dateFilter={dateFilter}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ProductDetailReviewsSidebar
              colors={colors}
              reviewStats={reviewStats}
              user={user}
              showReviewForm={showReviewForm}
              navigate={navigate}
              handleWriteReviewClick={handleWriteReviewClick}
            />

            <div className="lg:col-span-3">
              <ProductDetailReviewsForm {...props} />
              <div className="space-y-4">
                <ProductDetailReviewsListPanel {...props} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
