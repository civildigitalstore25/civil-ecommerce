import React from "react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import AdminPagination from "../components/AdminPagination";
import CouponsHeader from "./CouponsHeader";
import CouponsStats from "./CouponsStats";
import CouponsEmptyState from "./CouponsEmptyState";
import CouponCard from "./CouponCard";
import CouponFormModal from "./CouponFormModal";
import { useCouponsAdmin } from "./useCouponsAdmin";

const Coupons: React.FC = () => {
  const { colors, theme } = useAdminTheme();
  const {
    coupons,
    showForm,
    setShowForm,
    editingCoupon,
    setEditingCoupon,
    loading,
    error,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    fetchCoupons,
    handleAddCoupon,
    handleEdit,
    handleDelete,
    openCreate,
  } = useCouponsAdmin();

  const totalPages = Math.max(1, Math.ceil(coupons.length / pageSize));
  const paginatedCoupons = coupons.slice(
    (currentPage - 1) * pageSize,
    (currentPage - 1) * pageSize + pageSize,
  );

  return (
    <div
      className="p-6 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: colors.background.primary }}
    >
      <CouponsHeader colors={colors} theme={theme} onRefresh={fetchCoupons} onAdd={openCreate} />

      <CouponsStats colors={colors} coupons={coupons} />

      {error && (
        <div
          className="mb-4 p-4 rounded-lg border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.status.error,
          }}
        >
          <p style={{ color: colors.status.error }}>{error}</p>
          <button
            type="button"
            onClick={() => void fetchCoupons()}
            className="mt-2 px-4 py-2 rounded hover:opacity-90 transition"
            style={{
              backgroundColor: colors.status.error,
              color: colors.text.inverse,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: colors.interactive.primary }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.length === 0 ? (
            <CouponsEmptyState colors={colors} theme={theme} onCreate={openCreate} />
          ) : (
            <>
              {paginatedCoupons.map((coupon) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  colors={colors}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </div>
      )}

      {showForm && (
        <CouponFormModal
          key={editingCoupon?._id ?? "new"}
          onClose={() => {
            setShowForm(false);
            setEditingCoupon(null);
          }}
          onSave={handleAddCoupon}
          editingCoupon={editingCoupon}
          colors={colors}
          theme={theme}
        />
      )}
    </div>
  );
};

export default Coupons;
