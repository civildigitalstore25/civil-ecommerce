import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import AdminPagination from "./components/AdminPagination";
import ReviewFilters from "./reviews/ReviewFilters";
import ReviewTable from "./reviews/ReviewTable";
import ReviewEditModal from "./reviews/ReviewEditModal";
import ReviewsToolbar from "./reviews/ReviewsToolbar";
import { useUser } from "../../api/userQueries";
import { useAdminReviewsPage } from "./reviews/useAdminReviewsPage";

const Reviews: React.FC = () => {
  const { colors } = useAdminTheme();
  const { data: user } = useUser();
  const {
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
  } = useAdminReviewsPage(user);

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
      <ReviewsToolbar
        colors={colors}
        selectedCount={selectedReviews.length}
        onBulkDelete={handleBulkDelete}
      />

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

      {editingReview && (
        <ReviewEditModal
          colors={colors}
          editForm={editForm}
          setEditForm={setEditForm}
          onUpdate={handleUpdateReview}
          onCancel={cancelEdit}
        />
      )}

      <ReviewTable
        reviews={reviews}
        selectedReviews={selectedReviews}
        handleSelectAll={handleSelectAll}
        handleSelectReview={handleSelectReview}
        handleEditReview={handleEditReview}
        handleDeleteReview={handleDeleteReview}
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
