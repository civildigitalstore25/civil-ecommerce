import { useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import Swal from "sweetalert2";
import {
  addReplyToReview,
  updateReply,
  deleteReply,
  type Reply,
} from "../../api/reviewApi";

type UserShape = {
  id?: string;
  role?: string;
} | null | undefined;

export function useProductDetailReviewReply(
  productId: string | undefined,
  user: UserShape,
  navigate: NavigateFunction,
  loadReviews: (id: string) => Promise<void>
) {
  const [replyingToReview, setReplyingToReview] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState({ comment: "" });
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingReply, setEditingReply] = useState<{
    reviewId: string;
    replyId: string;
  } | null>(null);
  const [replyAsAnonymous, setReplyAsAnonymous] = useState(false);
  const [replyAnonymousName, setReplyAnonymousName] = useState("");
  const [showReplyTypeModal, setShowReplyTypeModal] = useState<string | null>(null);

  const handleReplyClick = (reviewId: string) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to reply",
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

    const isAdminUser = user?.role === "admin" || user?.role === "superadmin";

    setReplyForm({ comment: "" });
    setEditingReply(null);
    setReplyAsAnonymous(false);
    setReplyAnonymousName("");

    if (isAdminUser) {
      setShowReplyTypeModal(reviewId);
    } else {
      setReplyingToReview(reviewId);
    }
  };

  const handleReplyTypeSelect = (reviewId: string, asAnonymous: boolean) => {
    setReplyAsAnonymous(asAnonymous);
    setShowReplyTypeModal(null);
    setReplyingToReview(reviewId);

    if (asAnonymous) {
      setReplyAnonymousName("");
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!user || !productId) return;

    if (!replyForm.comment.trim()) {
      Swal.fire("Error", "Please enter a reply", "error");
      return;
    }

    if (replyAsAnonymous && !replyAnonymousName.trim()) {
      Swal.fire("Error", "Please enter a name for the reply", "error");
      return;
    }

    try {
      setSubmittingReply(true);

      if (editingReply) {
        await updateReply(editingReply.reviewId, editingReply.replyId, {
          comment: replyForm.comment,
        });
        Swal.fire("Success", "Reply updated successfully", "success");
      } else {
        const replyData: {
          comment: string;
          isAnonymous?: boolean;
          anonymousName?: string;
        } = {
          comment: replyForm.comment,
          ...(replyAsAnonymous
            ? { isAnonymous: true, anonymousName: replyAnonymousName.trim() }
            : {}),
        };

        await addReplyToReview(reviewId, replyData);

        const successMessage = replyAsAnonymous
          ? `Reply posted successfully as ${replyAnonymousName}!`
          : "Reply posted successfully";

        Swal.fire("Success", successMessage, "success");
      }

      setReplyForm({ comment: "" });
      setReplyingToReview(null);
      setEditingReply(null);
      setReplyAsAnonymous(false);
      setReplyAnonymousName("");

      await loadReviews(productId);
    } catch (error: unknown) {
      console.error("Reply submission error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit reply",
        "error"
      );
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleEditReply = (reviewId: string, reply: Reply) => {
    if (!user) return;

    const isAdmin = user.role === "admin" || user.role === "superadmin";
    const isOwner = reply.user && user.id === reply.user._id;

    if (!isAdmin && !isOwner) {
      Swal.fire("Error", "You can only edit your own replies", "error");
      return;
    }

    setEditingReply({ reviewId, replyId: reply._id });
    setReplyForm({ comment: reply.comment });
    setReplyingToReview(reviewId);
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (!user) return;

    const result = await Swal.fire({
      title: "Delete Reply",
      text: "Are you sure you want to delete this reply?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed || !productId) return;

    try {
      await deleteReply(reviewId, replyId);
      Swal.fire("Success", "Reply deleted successfully", "success");
      await loadReviews(productId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete reply",
        "error"
      );
    }
  };

  return {
    replyingToReview,
    setReplyingToReview,
    replyForm,
    setReplyForm,
    handleReplySubmit,
    handleReplyClick,
    handleEditReply,
    handleDeleteReply,
    submittingReply,
    editingReply,
    setEditingReply,
    replyAsAnonymous,
    setReplyAsAnonymous,
    replyAnonymousName,
    setReplyAnonymousName,
    showReplyTypeModal,
    setShowReplyTypeModal,
    handleReplyTypeSelect,
  };
}
