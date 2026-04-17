export function ProductDetailReviewReplyComposer({
  colors,
  reviewId,
  editingReply,
  replyAsAnonymous,
  replyAnonymousName,
  setReplyAnonymousName,
  replyForm,
  setReplyForm,
  submittingReply,
  onSubmit,
  onCancel,
}: {
  colors: any;
  reviewId: string;
  editingReply: { reviewId: string; replyId: string } | null;
  replyAsAnonymous: boolean;
  replyAnonymousName: string;
  setReplyAnonymousName: (v: string) => void;
  replyForm: { comment: string };
  setReplyForm: (v: { comment: string }) => void;
  submittingReply: boolean;
  onSubmit: (reviewId: string) => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="mt-4 p-4 rounded-lg"
      style={{ backgroundColor: colors.background.primary }}
    >
      <h6
        className="font-semibold mb-3 text-sm"
        style={{ color: colors.text.primary }}
      >
        {editingReply
          ? "Edit Reply"
          : replyAsAnonymous
            ? "Reply as User"
            : "Write a Reply"}
      </h6>
      {replyAsAnonymous && (
        <div className="mb-3">
          <label
            className="block mb-1 font-medium text-sm"
            style={{ color: colors.text.primary }}
          >
            Your Name
          </label>
          <input
            type="text"
            value={replyAnonymousName}
            onChange={(e) => setReplyAnonymousName(e.target.value)}
            className="w-full p-2 rounded border text-sm transition-colors"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            placeholder="Enter your name"
            required
          />
        </div>
      )}
      <textarea
        value={replyForm.comment}
        onChange={(e) => setReplyForm({ comment: e.target.value })}
        className="w-full p-3 rounded-lg border transition-colors text-sm"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
        rows={3}
        placeholder="Write your reply..."
        required
      />
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => onSubmit(reviewId)}
          disabled={submittingReply}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          style={{
            background: colors.interactive.primary || "#2563eb",
            color: "#ffffff",
            border: `1px solid ${colors.interactive.primary || "#2563eb"}`,
          }}
          onMouseEnter={(e) => {
            if (!submittingReply) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                (colors.interactive &&
                  (colors.interactive.primaryHover || colors.interactive.primary)) ||
                "#1e40af";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              colors.interactive.primary || "#2563eb";
          }}
        >
          {submittingReply
            ? "Submitting..."
            : editingReply
              ? "Update Reply"
              : "Post Reply"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            border: `1px solid ${colors.border.primary}`,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
