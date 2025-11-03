import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import {
  getAllReviews,
  deleteReview,
  updateReview,
  type Review,
} from "../../api/reviewApi";
import Swal from "sweetalert2";

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getAllReviews();
      setReviews(response.reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
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
      Swal.fire("Success", "Review deleted successfully", "success");
      loadReviews();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete review",
        "error",
      );
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async () => {
    if (!editingReview) return;

    try {
      await updateReview(editingReview._id, editForm);
      Swal.fire("Success", "Review updated successfully", "success");
      setEditingReview(null);
      loadReviews();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update review",
        "error",
      );
    }
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
            className={`text-lg ${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
            style={{
              color: star <= rating ? "#fbbf24" : colors.text.secondary,
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.interactive.primary }}
        ></div>
        <span className="ml-2" style={{ color: colors.text.secondary }}>
          Loading reviews...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Reviews Management
          </h2>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
            Manage customer reviews and feedback
          </p>
        </div>
        <div className="text-sm" style={{ color: colors.text.secondary }}>
          Total Reviews: {reviews.length}
        </div>
      </div>

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            style={{ backgroundColor: colors.background.secondary }}
          >
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Edit Review
            </h3>

            <div className="mb-4">
              <label
                className="block mb-2 font-medium"
                style={{ color: colors.text.primary }}
              >
                Rating
              </label>
              {renderStars(editForm.rating, true, (rating) =>
                setEditForm((prev) => ({ ...prev, rating })),
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
                value={editForm.comment}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, comment: e.target.value }))
                }
                className="w-full p-3 rounded-lg border transition-colors"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateReview}
                className="flex-1 font-bold py-2 px-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.background.primary,
                }}
              >
                Update
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 font-bold py-2 px-4 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                  border: `1px solid ${colors.border.primary}`,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Table */}
      <div
        className="rounded-xl shadow-xl border overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="border-b transition-colors duration-200"
              style={{
                backgroundColor: colors.background.tertiary,
                borderBottomColor: colors.border.primary,
              }}
            >
              <tr>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  User
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Product
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Rating
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Comment
                </th>
                <th
                  className="text-left py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Date
                </th>
                <th
                  className="text-center py-3 px-4 font-medium"
                  style={{ color: colors.text.primary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y transition-colors duration-200"
              style={{ borderColor: colors.border.secondary }}
            >
              {reviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center"
                    style={{ color: colors.text.secondary }}
                  >
                    No reviews found
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="transition-colors duration-200"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.background.accent)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: colors.background.tertiary,
                          }}
                        >
                          <span className="text-lg">👤</span>
                        </div>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: colors.text.primary }}
                          >
                            {review.user.fullName}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.text.secondary }}
                          >
                            {review.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {(review as any).product?.name || "Unknown Product"}
                      </div>
                    </td>
                    <td className="py-4 px-4">{renderStars(review.rating)}</td>
                    <td className="py-4 px-4 max-w-xs">
                      <div
                        className="truncate"
                        style={{ color: colors.text.secondary }}
                        title={review.comment}
                      >
                        {review.comment.length > 50
                          ? `${review.comment.substring(0, 50)}...`
                          : review.comment}
                      </div>
                    </td>
                    <td
                      className="py-4 px-4 text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="p-1 rounded transition-colors"
                          style={{ color: colors.interactive.primary }}
                          title="Edit Review"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.8")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-1 rounded transition-colors"
                          style={{ color: "#ef4444" }}
                          title="Delete Review"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.8")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
