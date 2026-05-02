import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAllReviews,
  deleteReview,
  updateReview,
  type Review,
} from "../../../api/reviewApi";
import {
  swalConfirmDestructive,
  swalError,
  swalFire,
  swalSuccess,
  swalSuccessBrief,
} from "../../../utils/swal";
import { axiosErrorMessage } from "../../../utils/axiosErrorMessage";

type UserLike = {
  id: string;
  role: string;
} | null;

export function useAdminReviewsPage(user: UserLike | undefined) {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchTerm, ratingFilter, dateFilter]);

  const totalReviews = allReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalReviews / pageSize) || 1);
  const reviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allReviews.slice(start, start + pageSize);
  }, [allReviews, currentPage, pageSize]);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllReviews({
        search: searchTerm || undefined,
        rating: ratingFilter || undefined,
        dateFilter: dateFilter !== "all" ? dateFilter : undefined,
      });
      setAllReviews(response.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      await swalError("Failed to load reviews", "Error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, ratingFilter, dateFilter]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  const handleDeleteReview = async (reviewId: string) => {
    const result = await swalFire({
      title: "Delete Review",
      text: "Are you sure you want to delete this review? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteReview(reviewId);
      await swalSuccess("Review deleted successfully", "Success");
      setSelectedReviews((prev) => prev.filter((id) => id !== reviewId));
      void loadReviews();
    } catch (err: unknown) {
      await swalError(axiosErrorMessage(err, "Failed to delete review"), "Error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    const count = selectedReviews.length;
    const ids = [...selectedReviews];
    const ok = await swalConfirmDestructive({
      text: `You are about to delete ${count} review(s). This action cannot be undone.`,
      confirmButtonText: "Yes, delete them!",
    });
    if (!ok) return;
    try {
      await Promise.all(ids.map((id) => deleteReview(id)));
      await swalSuccessBrief("Deleted!", `${count} review(s) have been deleted.`);
      setSelectedReviews([]);
      void loadReviews();
    } catch (err: unknown) {
      await swalError(axiosErrorMessage(err, "Failed to delete reviews"), "Error");
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) setSelectedReviews([]);
    else setSelectedReviews(reviews.map((r) => r._id));
  };

  const handleSelectReview = (id: string) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const handleEditReview = (review: Review) => {
    if (!user) {
      void swalError("Please login to edit reviews", "Error");
      return;
    }
    const isOwner = review.user ? user.id === review.user._id : false;
    const isAdmin = user.role === "admin" || user.role === "superadmin";
    if (!isOwner && !isAdmin) {
      void swalError("You can only edit your own reviews", "Error");
      return;
    }
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;
    try {
      await updateReview(editingReview._id, editForm);
      await swalSuccess("Review updated successfully", "Success");
      setEditingReview(null);
      void loadReviews();
    } catch (err: unknown) {
      await swalError(axiosErrorMessage(err, "Failed to update review"), "Error");
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setDateFilter("all");
    setCurrentPage(1);
  };

  return {
    reviews,
    loading,
    editingReview,
    editForm,
    setEditForm,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalReviews,
    searchTerm,
    setSearchTerm,
    ratingFilter,
    setRatingFilter,
    dateFilter,
    setDateFilter,
    selectedReviews,
    handleDeleteReview,
    handleBulkDelete,
    handleSelectAll,
    handleSelectReview,
    handleEditReview,
    handleUpdateReview,
    cancelEdit,
    clearFilters,
  };
}
