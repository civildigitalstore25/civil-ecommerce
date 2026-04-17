import { useState, useEffect } from "react";
import {
  getProductReviews,
  getProductReviewStats,
  type Review,
  type ReviewStats,
} from "../../api/reviewApi";
import {
  REVIEW_DATE_FILTERS,
  REVIEW_RATING_FILTERS,
  REVIEW_SORT_OPTIONS,
} from "../../constants/reviewConstants";

export function useProductDetailReviewsData(productId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string>(REVIEW_SORT_OPTIONS[0].value);
  const [ratingFilter, setRatingFilter] = useState<string>(
    REVIEW_RATING_FILTERS[0].value
  );
  const [dateFilter, setDateFilter] = useState<string>(REVIEW_DATE_FILTERS[0].value);
  const [customStartDate, setCustomStartDate] = useState<string | null>(null);
  const [customEndDate, setCustomEndDate] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviewComments, setExpandedReviewComments] = useState<Set<string>>(
    new Set()
  );
  const [expandedReplyComments, setExpandedReplyComments] = useState<Set<string>>(
    new Set()
  );
  const REVIEWS_INITIAL_COUNT = 2;

  const loadReviews = async (id: string) => {
    if (!id) return;
    try {
      setReviewsLoading(true);
      const response = await getProductReviews(id);
      setReviews(response.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadReviewStats = async (id: string) => {
    if (!id) return;
    try {
      const stats = await getProductReviewStats(id);
      setReviewStats(stats);
    } catch (error) {
      console.error("Error loading review stats:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews(productId);
      loadReviewStats(productId);
    }
  }, [productId]);

  useEffect(() => {
    setShowAllReviews(false);
    setExpandedReviewComments(new Set());
  }, [sortBy, ratingFilter, dateFilter, customStartDate, customEndDate]);

  return {
    reviews,
    reviewStats,
    reviewsLoading,
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
    showAllReviews,
    setShowAllReviews,
    reviewsInitialCount: REVIEWS_INITIAL_COUNT,
    expandedReviewComments,
    setExpandedReviewComments,
    expandedReplyComments,
    setExpandedReplyComments,
    loadReviews,
    loadReviewStats,
  };
}
