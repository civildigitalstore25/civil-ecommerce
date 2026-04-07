import type { Reply } from "../../../api/reviewApi";
import { ProductDetailReviewExpandableText } from "./ProductDetailReviewExpandableText";

type UserShape = { id?: string; role?: string } | null | undefined;

export function ProductDetailReviewReplyItem({
  reviewId,
  reply,
  colors,
  user,
  expandedReplyComments,
  setExpandedReplyComments,
  onEdit,
  onDelete,
}: {
  reviewId: string;
  reply: Reply;
  colors: any;
  user: UserShape;
  expandedReplyComments: Set<string>;
  setExpandedReplyComments: (s: Set<string>) => void;
  onEdit: (reviewId: string, reply: Reply) => void;
  onDelete: (reviewId: string, replyId: string) => void;
}) {
  const canModerate =
    user &&
    (user.id === reply.user?._id ||
      user.role === "admin" ||
      user.role === "superadmin");

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{
              backgroundColor:
                colors.interactive.secondary || colors.interactive.primary,
              color: "#fff",
            }}
          >
            {reply.isAnonymous && reply.anonymousName
              ? reply.anonymousName.charAt(0).toUpperCase()
              : reply.user?.fullName
                ? reply.user.fullName.charAt(0).toUpperCase()
                : "U"}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <h6
                className="font-semibold text-sm"
                style={{ color: colors.text.primary }}
              >
                {reply.isAnonymous
                  ? reply.anonymousName || "Anonymous User"
                  : reply.user?.fullName || "Anonymous User"}
              </h6>
              <span className="text-xs" style={{ color: colors.text.secondary }}>
                {new Date(reply.createdAt).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
            <ProductDetailReviewExpandableText
              id={reply._id}
              text={reply.comment || ""}
              expandedIds={expandedReplyComments}
              setExpandedIds={setExpandedReplyComments}
              colors={colors}
            />
          </div>
        </div>
        {canModerate && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEdit(reviewId, reply)}
              className="text-xs font-medium px-2 py-1 rounded transition-colors"
              style={{
                color: colors.interactive.primary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(reviewId, reply._id)}
              className="text-xs font-medium px-2 py-1 rounded transition-colors"
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
