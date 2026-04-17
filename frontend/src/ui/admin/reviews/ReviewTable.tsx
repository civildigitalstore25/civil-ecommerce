import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { Review } from "../../../api/reviewApi";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import ReviewStarRating from "./ReviewStarRating";

function productName(product: Review["product"]): string {
  if (typeof product === "object" && product !== null && "name" in product) {
    return product.name;
  }
  return "Unknown Product";
}

interface ReviewTableProps {
  reviews: Review[];
  selectedReviews: string[];
  handleSelectAll: () => void;
  handleSelectReview: (id: string) => void;
  handleEditReview: (review: Review) => void;
  handleDeleteReview: (reviewId: string) => void;
}

const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  selectedReviews,
  handleSelectAll,
  handleSelectReview,
  handleEditReview,
  handleDeleteReview,
}) => {
  const { colors } = useAdminTheme();

  return (
    <div
      className="rounded-xl shadow-xl border overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b transition-colors duration-200" style={{ borderColor: colors.border.primary }}>
            <tr>
              <th className="text-center py-3 px-4" style={{ color: colors.text.primary }}>
                <input
                  type="checkbox"
                  checked={selectedReviews.length === reviews.length && reviews.length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                User
              </th>
              <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                Product
              </th>
              <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                Rating
              </th>
              <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                Comment
              </th>
              <th className="text-left py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                Date
              </th>
              <th className="text-center py-3 px-4 font-medium" style={{ color: colors.text.primary }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: colors.border.secondary }}>
            {reviews.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="py-4 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review._id)}
                      onChange={() => handleSelectReview(review._id)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <div className="font-medium" style={{ color: colors.text.primary }}>
                          {review.isAnonymous
                            ? (review.anonymousName || "Anonymous User")
                            : (review.user?.fullName || "Deleted User")}
                        </div>
                        <div className="text-sm" style={{ color: colors.text.secondary }}>
                          {review.isAnonymous
                            ? "Anonymous Review"
                            : (review.user?.email || "N/A")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium" style={{ color: colors.text.primary }}>
                      {productName(review.product)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <ReviewStarRating
                      rating={review.rating}
                      mutedStarColor={colors.text.secondary}
                    />
                  </td>
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
                  <td className="py-4 px-4 text-sm" style={{ color: colors.text.secondary }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-1 rounded transition-colors"
                        style={{ color: colors.interactive.primary }}
                        title="Edit Review"
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="p-1 rounded transition-colors"
                        style={{ color: "#ef4444" }}
                        title="Delete Review"
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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
  );
};

export default ReviewTable;
