import React from "react";
import type { User } from "../../../api/types/userTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import UserTable from "./UserTable";
import AdminPagination from "../components/AdminPagination";

type Props = {
  colors: ThemeColors;
  isLoading: boolean;
  error: unknown;
  filteredUsers: User[];
  selectedUsers: string[];
  handleRoleChange: (
    userId: string,
    newRole: "user" | "admin" | "superadmin",
  ) => void;
  handleDeleteUser: (userId: string, userEmail: string) => void;
  handleSelectAll: () => void;
  handleSelectUser: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
};

const UserManagementUsersPanel: React.FC<Props> = ({
  colors,
  isLoading,
  error,
  filteredUsers,
  selectedUsers,
  handleRoleChange,
  handleDeleteUser,
  handleSelectAll,
  handleSelectUser,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => (
  <>
    {isLoading && (
      <div className="text-center py-8" style={{ color: colors.text.primary }}>
        Loading users...
      </div>
    )}
    {error && (
      <div className="text-center py-8" style={{ color: colors.status.error }}>
        Error loading users
      </div>
    )}
    {!isLoading && !error && (
      <>
        <UserTable
          users={filteredUsers}
          handleRoleChange={handleRoleChange}
          handleDeleteUser={handleDeleteUser}
          selectedUsers={selectedUsers}
          handleSelectAll={handleSelectAll}
          handleSelectUser={handleSelectUser}
        />
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      </>
    )}
  </>
);

export default UserManagementUsersPanel;
