import { useState, type FormEvent } from "react";
import type { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";
import {
  createReview,
  updateReview,
  deleteReview,
  type Review,
  type CreateReviewData,
  type UpdateReviewData,
} from "../../api/reviewApi";

type UserShape = {
  id?: string;
  role?: string;
} | null | undefined;

export function useProductDetailReviewForm(
  productId: string | undefined,
  user: UserShape,
  navigate: NavigateFunction,
  loadReviews: (id: string) => Promise<void>,
  loadReviewStats: (id: string) => Promise<void>
) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDate, setReviewDate] = useState<string | null>(null);
  const [showReviewTypeModal, setShowReviewTypeModal] = useState(false);
  const [reviewAsAnonymous, setReviewAsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to post a review",
        icon: "info",
        confirmButtonText: "Login",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      Swal.fire("Error", "Please enter a comment", "error");
      return;
    }

    if (reviewAsAnonymous && !anonymousName.trim()) {
      Swal.fire("Error", "Please enter a name for the review", "error");
      return;
    }

    if (!productId) return;

    try {
      setSubmittingReview(true);
      if (editingReview) {
        const updateData: UpdateReviewData = {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        };

        if ((user?.role === "admin" || user?.role === "superadmin") && reviewDate) {
          updateData.createdAt = new Date(reviewDate).toISOString();
        }

        await updateReview(editingReview._id, updateData);
        Swal.fire("Success", "Review updated successfully", "success");
      } else {
        const reviewData: CreateReviewData = {
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          ...(reviewAsAnonymous
            ? { isAnonymous: true, anonymousName: anonymousName.trim() }
            : {}),
          ...((user?.role === "admin" || user?.role === "superadmin") && reviewDate
            ? { createdAt: new Date(reviewDate).toISOString() }
            : {}),
        };

        await createReview(productId, reviewData);

        const successMessage = reviewAsAnonymous
          ? `Review posted successfully as ${anonymousName}!`
          : "Review posted successfully";

        Swal.fire("Success", successMessage, "success");
      }

      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewAsAnonymous(false);
      setAnonymousName("");
      setReviewDate(null);

      await loadReviews(productId);
      await loadReviewStats(productId);
    } catch (error: unknown) {
      console.error("Review submission error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleWriteReviewClick = () => {
    const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

    setReviewForm({ rating: 5, comment: "" });
    setEditingReview(null);
    setReviewAsAnonymous(false);
    setAnonymousName("");
    setReviewDate(null);

    if (isAdminUser) {
      setShowReviewTypeModal(true);
    } else {
      setShowReviewForm(true);
    }
  };

  const handleReviewTypeSelect = (asAnonymous: boolean) => {
    setReviewAsAnonymous(asAnonymous);
    setShowReviewTypeModal(false);
    setShowReviewForm(true);

    if (user?.role === "admin" || user?.role === "superadmin") {
      setReviewDate(new Date().toISOString().slice(0, 10));
    }

    if (asAnonymous) {
      setAnonymousName("");
    }
  };

  const handleEditReview = (review: Review) => {
    if (!user) {
      Swal.fire("Error", "Please login to edit reviews", "error");
      return;
    }

    const isAdmin = user.role === "admin" || user.role === "superadmin";
    const isOwner = review.user && user.id === review.user._id;

    if (!isAdmin && !isOwner) {
      Swal.fire("Error", "You can only edit your own reviews", "error");
      return;
    }

    setEditingReview(review);
    setReviewForm({ rating: review.rating, comment: review.comment });
    if (isAdmin) {
      try {
        setReviewDate(new Date(review.createdAt).toISOString().slice(0, 10));
      } catch {
        setReviewDate(null);
      }
    }
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;

    const result = await Swal.fire({
      title: "Delete Review",
      text: "Are you sure you want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed || !productId) return;

    try {
      await deleteReview(reviewId);
      Swal.fire("Success", "Review deleted successfully", "success");
      await loadReviews(productId);
      await loadReviewStats(productId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete review",
        "error"
      );
    }
  };

  return {
    showReviewForm,
    setShowReviewForm,
    handleWriteReviewClick,
    handleReviewSubmit,
    reviewForm,
    setReviewForm,
    editingReview,
    setEditingReview,
    handleEditReview,
    handleDeleteReview,
    submittingReview,
    reviewDate,
    setReviewDate,
    reviewAsAnonymous,
    setReviewAsAnonymous,
    anonymousName,
    setAnonymousName,
    showReviewTypeModal,
    setShowReviewTypeModal,
    handleReviewTypeSelect,
  };
}
