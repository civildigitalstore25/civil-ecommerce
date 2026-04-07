import { Plus } from "lucide-react";
import { getAllParentMenus } from "./menuManagement/menuTreeUtils";
import { useMenuManagement } from "./menuManagement/useMenuManagement";
import { MenuManagementLoading } from "./menuManagement/MenuManagementLoading";
import { MenuManagementErrorAlert } from "./menuManagement/MenuManagementErrorAlert";
import { MenuManagementMenuTree } from "./menuManagement/MenuManagementMenuTree";
import { MenuManagementAddForm } from "./menuManagement/MenuManagementAddForm";

const MenuManagement = () => {
  const {
    colors,
    menus,
    loading,
    error,
    setError,
    showAddForm,
    setShowAddForm,
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useMenuManagement();

  if (loading) {
    return <MenuManagementLoading colors={colors} />;
  }

  return (
    <div className="p-6" style={{ backgroundColor: colors.background.primary }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>
            Menu Management
          </h1>
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "#fff",
            }}
          >
            <Plus size={20} />
            Add Menu
          </button>
        </div>

        {error && (
          <MenuManagementErrorAlert message={error} onDismiss={() => setError(null)} />
        )}

        {showAddForm && (
          <MenuManagementAddForm
            colors={colors}
            formData={formData}
            parentOptions={getAllParentMenus(menus)}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        <div className="space-y-2">
          {menus.length === 0 ? (
            <div className="text-center py-12" style={{ color: colors.text.secondary }}>
              <p className="text-lg">
                No menus found. Create your first menu to get started.
              </p>
            </div>
          ) : (
            <MenuManagementMenuTree menus={menus} colors={colors} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;
