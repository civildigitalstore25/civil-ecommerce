import React from "react";
import { Search, Users } from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  roleFilter: string;
  setRoleFilter: (val: string) => void;
  clearFilters: () => void;
  totalUsers: number;
}

const UserFilters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  clearFilters,
  totalUsers,
}) => {
  const { colors } = useAdminTheme();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search box */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: colors.text.secondary }}
          />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 w-full sm:w-64 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>

        {/* Role filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-32 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.interactive.primary;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.border.primary;
          }}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>



        {/* Clear button */}
        {(searchTerm || roleFilter) && (
          <button
            onClick={clearFilters}
            className="text-sm transition-colors duration-200"
            style={{ color: colors.interactive.primary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.interactive.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.interactive.primary;
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Total users */}
      <div
        className="flex items-center space-x-2 text-sm"
        style={{ color: colors.text.secondary }}
      >
        <Users className="w-4 h-4" />
        <span>{totalUsers} users total</span>
      </div>
    </div>
  );
};

export default UserFilters;
