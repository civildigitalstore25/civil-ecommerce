import BannerForm from "./banner/BannerForm";
import { useAdminThemeStyles } from "../../hooks/useAdminThemeStyles";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import AdminPagination from "./components/AdminPagination";
import { useBannerAdminPage } from "./banner/useBannerAdminPage";
import { BannerAdminHeader } from "./banner/BannerAdminHeader";
import { BannerAdminEmptyState } from "./banner/BannerAdminEmptyState";
import { BannerAdminListItem } from "./banner/BannerAdminListItem";

const BannerManagement = () => {
  const { cardStyle } = useAdminThemeStyles();
  const { colors, theme } = useAdminTheme();
  const page = useBannerAdminPage();

  return (
    <div
      className="p-6 sm:p-8 min-h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      {page.showForm && (
        <BannerForm
          banner={page.editingBanner}
          onClose={page.closeForm}
          onSubmit={page.handleFormSubmit}
        />
      )}

      <BannerAdminHeader colors={colors} onAdd={page.openCreate} />

      <div className="mt-4 sm:mt-6 flex flex-col gap-4">
        {page.loading ? (
          <div
            className="text-center py-16"
            style={{ color: colors.text.secondary }}
          >
            Loading...
          </div>
        ) : page.banners.length === 0 ? (
          <BannerAdminEmptyState
            colors={colors}
            theme={theme}
            onCreate={page.openCreate}
          />
        ) : (
          page.paginatedBanners.map((b, idx) => (
            <BannerAdminListItem
              key={b._id ?? idx}
              banner={b}
              index={idx}
              colors={colors}
              theme={theme}
              cardStyle={cardStyle}
              onEdit={page.openEdit}
              onDelete={page.handleDelete}
            />
          ))
        )}
      </div>

      {page.banners.length > 0 && (
        <AdminPagination
          currentPage={page.currentPage}
          totalPages={page.totalPages}
          onPageChange={page.setCurrentPage}
          pageSize={page.pageSize}
          onPageSizeChange={page.setPageSize}
        />
      )}
    </div>
  );
};

export default BannerManagement;
