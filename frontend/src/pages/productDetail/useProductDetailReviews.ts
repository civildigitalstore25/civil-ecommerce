import type { NavigateFunction } from "react-router-dom";
import { useProductDetailReviewsData } from "./useProductDetailReviewsData";
import { useProductDetailReviewForm } from "./useProductDetailReviewForm";
import { useProductDetailReviewReply } from "./useProductDetailReviewReply";

type UserShape = {
  id?: string;
  role?: string;
} | null | undefined;

export function useProductDetailReviews(
  productId: string | undefined,
  user: UserShape,
  navigate: NavigateFunction
) {
  const reviewsData = useProductDetailReviewsData(productId);
  
  const reviewForm = useProductDetailReviewForm(
    productId,
    user,
    navigate,
    reviewsData.loadReviews,
    reviewsData.loadReviewStats
  );

  const reviewReply = useProductDetailReviewReply(
    productId,
    user,
    navigate,
    reviewsData.loadReviews
  );

  return {
    ...reviewsData,
    ...reviewForm,
    ...reviewReply,
  };
}
