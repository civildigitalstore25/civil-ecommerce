import { useState, useEffect } from "react";
import {
  getRecentReviews,
  type Review as ApiReview,
} from "../../../api/reviewApi";

export function useHomeReviewsSection() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentReviews(21);
        setReviews(data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReviews();
  }, []);

  return { reviews, isLoading };
}
