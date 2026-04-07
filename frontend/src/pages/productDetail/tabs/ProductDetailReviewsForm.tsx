import type { ProductDetailReviewsTabProps } from "./tabTypes";

export function ProductDetailReviewsForm(props: ProductDetailReviewsTabProps) {
  const {
    colors,
    user,
    showReviewForm,
    editingReview,
    reviewAsAnonymous,
    anonymousName,
    setAnonymousName,
    reviewForm,
    setReviewForm,
    reviewDate,
    setReviewDate,
    handleReviewSubmit,
    submittingReview,
    setShowReviewForm,
    setEditingReview,
    setReviewAsAnonymous,
  } = props;

  if (!showReviewForm || !user) return null;

  return (
    <div
      className="rounded-2xl p-6 mb-8 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <h4
        className="text-xl font-bold mb-4"
        style={{ color: colors.text.primary }}
      >
        {editingReview
          ? "Edit Review"
          : reviewAsAnonymous
            ? "Write Review as User"
            : "Write a Review"}
      </h4>
      <form onSubmit={handleReviewSubmit}>
        {reviewAsAnonymous && (
          <div className="mb-4">
            <label
              className="block mb-2 font-medium"
              style={{ color: colors.text.primary }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              className="w-full p-3 rounded-lg border transition-colors"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              placeholder="Enter your name"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label
            className="block mb-2 font-medium"
            style={{ color: colors.text.primary }}
          >
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewForm((prev) => ({
                    ...prev,
                    rating: star,
                  }))
                }
                className="text-2xl transition-colors"
                style={{
                  color:
                    star <= reviewForm.rating
                      ? "#fbbf24"
                      : colors.text.secondary,
                }}
              >
                ★
              </button>
            ))}
          </div>
          {(user?.role === "admin" || user?.role === "superadmin") && (
            <div className="mb-4">
              <label
                className="block mb-2 font-medium"
                style={{ color: colors.text.primary }}
              >
                Review Date
              </label>
              <input
                type="date"
                value={reviewDate || ""}
                onChange={(e) => setReviewDate(e.target.value || null)}
                className="w-full p-3 rounded-lg border transition-colors"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 font-medium"
            style={{ color: colors.text.primary }}
          >
            Comment
          </label>
          <textarea
            value={reviewForm.comment}
            onChange={(e) =>
              setReviewForm((prev) => ({
                ...prev,
                comment: e.target.value,
              }))
            }
            className="w-full p-3 rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            rows={4}
            placeholder="Share your experience with this product..."
            required
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submittingReview}
            className="font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
            style={{
              background: colors.interactive.primary || "#2563eb",
              color: "#ffffff",
              border: `1.5px solid ${colors.interactive.primary || "#2563eb"}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                (colors.interactive &&
                  (colors.interactive.primaryHover ||
                    colors.interactive.primary)) ||
                "#1e40af";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                colors.interactive.primary || "#2563eb";
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
          >
            {submittingReview
              ? "Submitting..."
              : editingReview
                ? "Update Review"
                : "Post Review"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowReviewForm(false);
              setEditingReview(null);
              setReviewForm({ rating: 5, comment: "" });
              setReviewAsAnonymous(false);
              setAnonymousName("");
              setReviewDate(null);
            }}
            className="font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
              border: `1px solid ${colors.border.primary}`,
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
