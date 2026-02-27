import React, { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import AdminPagination from "./components/AdminPagination";
import ReviewFilters from "./reviews/ReviewFilters";
import ReviewTable from "./reviews/ReviewTable";
import { useUser } from "../../api/userQueries";
import {
  getAllReviews,
  deleteReview,
  updateReview,
  type Review,
} from "../../api/reviewApi";
import Swal from "sweetalert2";

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const { data: user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchTerm, ratingFilter, dateFilter]);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllReviews({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        rating: ratingFilter || undefined,
        dateFilter: dateFilter !== "all" ? dateFilter : undefined,
      });
      setReviews(response.reviews);
      setTotalPages(response.pagination?.pages || 1);
      setTotalReviews(response.pagination?.total || response.reviews.length);
    } catch (error) {
      console.error("Error loading reviews:", error);
      Swal.fire("Error", "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, ratingFilter, dateFilter]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

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
      setSelectedReviews((prev) => prev.filter((id) => id !== reviewId));
      loadReviews();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete review",
        "error",
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedReviews.length} review(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(selectedReviews.map((id) => deleteReview(id)));
      Swal.fire({
        title: "Deleted!",
        text: `${selectedReviews.length} review(s) have been deleted.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setSelectedReviews([]);
      loadReviews();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to delete reviews",
        "error",
      );
    }
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((r) => r._id));
    }
  };

  const handleSelectReview = (id: string) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const handleEditReview = (review: Review) => {
    if (!user) {
      Swal.fire("Error", "Please login to edit reviews", "error");
      return;
    }

    const isOwner = review.user ? user.id === review.user._id : false;
    const isAdmin = user.role === "admin" || user.role === "superadmin";

    if (!isOwner && !isAdmin) {
      Swal.fire("Error", "You can only edit your own reviews", "error");
      return;
    }

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

  const clearFilters = () => {
    setSearchTerm("");
    setRatingFilter("");
    setDateFilter("all");
    setCurrentPage(1);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void,
  ) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
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

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.interactive.primary }}
        />
        <span className="ml-2" style={{ color: colors.text.secondary }}>
          Loading reviews...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
        <div className="flex gap-2 items-center">
          {selectedReviews.length > 0 && (
            <button
              className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedReviews.length})
            </button>
          )}
        </div>
      </div>

      <ReviewFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        clearFilters={clearFilters}
        totalReviews={totalReviews}
      />

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-lg p-6 w-full max-w-md mx-4"
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
                className="flex-1 font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                style={{
                  background: colors.interactive.primary,
                  color: "#fff",
                  border: `1.5px solid ${colors.interactive.primary}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    colors.interactive.primaryHover || colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    colors.interactive.primary;
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
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    (colors as any).background?.accent || colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    colors.background.primary;
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ReviewTable
        reviews={reviews}
        selectedReviews={selectedReviews}
        handleSelectAll={handleSelectAll}
        handleSelectReview={handleSelectReview}
        handleEditReview={handleEditReview}
        handleDeleteReview={handleDeleteReview}
        renderStars={renderStars}
      />

      {totalPages > 1 && (
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
};

export default Reviews;
