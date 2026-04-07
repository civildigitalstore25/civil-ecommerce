import React, { type Dispatch, type SetStateAction } from "react";
import { Plus, ChevronDown } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  selectedCount: number;
  onBulkDelete: () => void;
  onAddUser: () => void;
  exportOpen: boolean;
  setExportOpen: Dispatch<SetStateAction<boolean>>;
  onExportExcel: () => Promise<void>;
  onExportJSON: () => Promise<void>;
};

const UserManagementToolbar: React.FC<Props> = ({
  colors,
  selectedCount,
  onBulkDelete,
  onAddUser,
  exportOpen,
  setExportOpen,
  onExportExcel,
  onExportJSON,
}) => (
  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <div>
      <h2
        className="text-2xl font-bold font-poppins"
        style={{ color: colors.text.primary }}
      >
        User Management
      </h2>
      <p className="text-sm mt-1 font-lato" style={{ color: colors.text.secondary }}>
        Manage user accounts and permissions
      </p>
    </div>
    <div className="flex gap-2 items-center">
      {selectedCount > 0 && (
        <button
          type="button"
          className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
          onClick={onBulkDelete}
        >
          <Plus className="h-4 w-4" />
          Delete Selected ({selectedCount})
        </button>
      )}
      <button
        type="button"
        className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 gap-2 shadow-md"
        style={{
          background: "#0068ff",
          color: "#fff",
          border: "none",
        }}
        onClick={onAddUser}
      >
        <Plus className="h-4 w-4" />
        Add User
      </button>
      <div className="relative">
        <button
          type="button"
          className="px-4 py-2 rounded-lg flex items-center font-medium transition-colors duration-200 gap-2 border"
          style={{
            background: colors.background.primary,
            color: colors.text.primary,
            border: `1px solid ${colors.interactive.primary}`,
            minWidth: 110,
          }}
          onClick={() => setExportOpen((v) => !v)}
        >
          Export <ChevronDown className="h-4 w-4" />
        </button>
        {exportOpen && (
          <div
            className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-10"
            style={{
              background: colors.background.secondary,
              border: `1px solid ${colors.border.primary}`,
            }}
          >
            <button
              type="button"
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
              style={{ color: colors.text.primary }}
              onClick={async () => {
                await onExportExcel();
                setExportOpen(false);
              }}
            >
              Export to Excel
            </button>
            <button
              type="button"
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
              style={{ color: colors.text.primary }}
              onClick={async () => {
                await onExportJSON();
                setExportOpen(false);
              }}
            >
              Export to JSON
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default UserManagementToolbar;
