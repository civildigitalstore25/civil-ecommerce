import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { Product } from "../../../api/types/productTypes";
import type { Reply, Review, ReviewStats } from "../../../api/reviewApi";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

export type ProductDetailTabKey =
  | "details"
  | "features"
  | "requirements"
  | "reviews"
  | "faq";

export type ProductDetailTabNavProps = {
  colors: ThemeColors;
  renderedTabs: ProductDetailTabKey[];
  activeTab: ProductDetailTabKey;
  setActiveTab: (tab: ProductDetailTabKey) => void;
  reviewTotalCount: number;
};

export type ProductDetailReviewsTabProps = {
  colors: ThemeColors;
  product: Product;
  user: { id?: string; role?: string; fullName?: string } | null | undefined;
  navigate: NavigateFunction;
  reviewStats: ReviewStats | null;
  reviews: Review[];
  reviewsLoading: boolean;
  sortBy: string;
  setSortBy: (v: string) => void;
  ratingFilter: string;
  setRatingFilter: (v: string) => void;
  dateFilter: string;
  setDateFilter: (v: string) => void;
  customStartDate: string | null;
  setCustomStartDate: (v: string | null) => void;
  customEndDate: string | null;
  setCustomEndDate: (v: string | null) => void;
  showReviewForm: boolean;
  setShowReviewForm: (v: boolean) => void;
  handleWriteReviewClick: () => void;
  handleReviewSubmit: (e: FormEvent) => void;
  reviewForm: { rating: number; comment: string };
  setReviewForm: Dispatch<SetStateAction<{ rating: number; comment: string }>>;
  editingReview: Review | null;
  setEditingReview: (v: Review | null) => void;
  handleEditReview: (review: Review) => void;
  handleDeleteReview: (id: string) => void;
  submittingReview: boolean;
  showAllReviews: boolean;
  setShowAllReviews: (v: boolean) => void;
  reviewsInitialCount: number;
  expandedReviewComments: Set<string>;
  setExpandedReviewComments: Dispatch<SetStateAction<Set<string>>>;
  expandedReplyComments: Set<string>;
  setExpandedReplyComments: Dispatch<SetStateAction<Set<string>>>;
  replyingToReview: string | null;
  setReplyingToReview: (v: string | null) => void;
  replyForm: { comment: string };
  setReplyForm: Dispatch<SetStateAction<{ comment: string }>>;
  handleReplySubmit: (reviewId: string) => void;
  handleReplyClick: (reviewId: string) => void;
  handleEditReply: (reviewId: string, reply: Reply) => void;
  handleDeleteReply: (reviewId: string, replyId: string) => void;
  submittingReply: boolean;
  reviewDate: string | null;
  setReviewDate: (v: string | null) => void;
  reviewAsAnonymous: boolean;
  setReviewAsAnonymous: (v: boolean) => void;
  anonymousName: string;
  setAnonymousName: (v: string) => void;
  editingReply: { reviewId: string; replyId: string } | null;
  setEditingReply: (v: { reviewId: string; replyId: string } | null) => void;
  replyAsAnonymous: boolean;
  setReplyAsAnonymous: (v: boolean) => void;
  replyAnonymousName: string;
  setReplyAnonymousName: (v: string) => void;
};
