import * as LucideIcons from "lucide-react";
import type { Review } from "../../../api/reviewApi";
import type { ProductDetailReviewsTabProps } from "./tabTypes";
import { ProductDetailReviewExpandableText } from "./ProductDetailReviewExpandableText";
import { ProductDetailReviewReplyItem } from "./ProductDetailReviewReplyItem";
import { ProductDetailReviewReplyComposer } from "./ProductDetailReviewReplyComposer";

export type ProductDetailReviewCardProps = ProductDetailReviewsTabProps & {
  review: Review;
};

export function ProductDetailReviewCard({
  colors,
  review,
  user,
  expandedReviewComments,
  setExpandedReviewComments,
  expandedReplyComments,
  setExpandedReplyComments,
  replyingToReview,
  setReplyingToReview,
  replyForm,
  setReplyForm,
  handleReplySubmit,
  handleReplyClick,
  handleEditReply,
  handleDeleteReply,
  submittingReply,
  handleEditReview,
  handleDeleteReview,
  editingReply,
  setEditingReply,
  replyAsAnonymous,
  setReplyAsAnonymous,
  replyAnonymousName,
  setReplyAnonymousName,
}: ProductDetailReviewCardProps) {
  const canEditReview =
    user &&
    (user.id === review.user?._id ||
      user.role === "admin" ||
      user.role === "superadmin");

  return (
    <div
      className="rounded-xl p-5 border transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "#fff",
            }}
          >
            {review.isAnonymous && review.anonymousName
              ? review.anonymousName.charAt(0).toUpperCase()
              : review.user?.fullName
                ? review.user.fullName.charAt(0).toUpperCase()
                : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <h5
              className="font-bold text-base mb-1"
              style={{ color: colors.text.primary }}
            >
              {review.isAnonymous
                ? review.anonymousName || "Anonymous User"
                : review.user?.fullName || "Anonymous User"}
            </h5>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <ProductDetailReviewExpandableText
              id={review._id}
              text={review.comment}
              expandedIds={expandedReviewComments}
              setExpandedIds={setExpandedReviewComments}
              colors={colors}
            />

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleReplyClick(review._id)}
                className="text-sm font-medium flex items-center gap-1 transition-colors"
                style={{ color: colors.interactive.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <LucideIcons.MessageCircle size={16} />
                Reply
              </button>
              {review.replies && review.replies.length > 0 && (
                <span className="text-xs" style={{ color: colors.text.secondary }}>
                  {review.replies.length}{" "}
                  {review.replies.length === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>

            {review.replies && review.replies.length > 0 && (
              <div
                className="mt-4 space-y-3 pl-4 border-l-2"
                style={{ borderColor: colors.border.primary }}
              >
                {review.replies.map((reply) => (
                  <ProductDetailReviewReplyItem
                    key={reply._id}
                    reviewId={review._id}
                    reply={reply}
                    colors={colors}
                    user={user}
                    expandedReplyComments={expandedReplyComments}
                    setExpandedReplyComments={setExpandedReplyComments}
                    onEdit={handleEditReply}
                    onDelete={handleDeleteReply}
                  />
                ))}
              </div>
            )}

            {replyingToReview === review._id && (
              <ProductDetailReviewReplyComposer
                colors={colors}
                reviewId={review._id}
                editingReply={editingReply}
                replyAsAnonymous={replyAsAnonymous}
                replyAnonymousName={replyAnonymousName}
                setReplyAnonymousName={setReplyAnonymousName}
                replyForm={replyForm}
                setReplyForm={setReplyForm}
                submittingReply={submittingReply}
                onSubmit={handleReplySubmit}
                onCancel={() => {
                  setReplyingToReview(null);
                  setReplyForm({ comment: "" });
                  setEditingReply(null);
                  setReplyAsAnonymous(false);
                  setReplyAnonymousName("");
                }}
              />
            )}
          </div>
        </div>
        {canEditReview && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => handleEditReview(review)}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: colors.interactive.primary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.background.accent || colors.background.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDeleteReview(review._id)}
              className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: "#ef4444",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fee2e2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
