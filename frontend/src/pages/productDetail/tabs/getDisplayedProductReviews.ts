import type { Review } from "../../../api/reviewApi";

export type DisplayedProductReviewsOptions = {
  ratingFilter: string;
  dateFilter: string;
  customStartDate: string | null;
  customEndDate: string | null;
  sortBy: string;
  showAllReviews: boolean;
  initialCount: number;
};

export function getDisplayedProductReviews(
  reviews: Review[],
  opts: DisplayedProductReviewsOptions
): { displayed: Review[]; shouldCollapse: boolean } {
  const now = new Date();
  let filtered = [...reviews];

  if (opts.ratingFilter !== "all") {
    const r = parseInt(opts.ratingFilter, 10);
    filtered = filtered.filter((rv) => rv.rating === r);
  }

  if (opts.dateFilter === "last-week") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    filtered = filtered.filter((rv) => new Date(rv.createdAt) >= weekAgo);
  } else if (opts.dateFilter === "last-month") {
    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);
    filtered = filtered.filter((rv) => new Date(rv.createdAt) >= monthAgo);
  } else if (opts.dateFilter === "last-year") {
    const yearAgo = new Date();
    yearAgo.setFullYear(now.getFullYear() - 1);
    filtered = filtered.filter((rv) => new Date(rv.createdAt) >= yearAgo);
  } else if (opts.dateFilter === "custom" && opts.customStartDate) {
    const start = new Date(opts.customStartDate);
    const end = opts.customEndDate ? new Date(opts.customEndDate) : now;
    filtered = filtered.filter((rv) => {
      const d = new Date(rv.createdAt);
      return d >= start && d <= end;
    });
  }

  if (opts.sortBy === "newest") {
    filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  } else if (opts.sortBy === "oldest") {
    filtered.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  } else if (opts.sortBy === "highest") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (opts.sortBy === "lowest") {
    filtered.sort((a, b) => a.rating - b.rating);
  }

  const shouldCollapse = filtered.length > opts.initialCount;
  const displayed =
    shouldCollapse && !opts.showAllReviews
      ? filtered.slice(0, opts.initialCount)
      : filtered;

  return { displayed, shouldCollapse };
}
