import React, { useState } from "react";
import { useUsers, useUpdateUser, useDeleteUser } from "../../../api/userApi";
import type { User } from "../../../api/types/userTypes";
import Swal from "sweetalert2";
import { Plus } from "lucide-react";
import UserFilters from "./UserFilter";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import AddUserModal from "./AddUserModal";
// import FormButton from "../../../components/Button/FormButton";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

const UserManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const limit = 10;

  const { data: usersData, isLoading, error } = useUsers({
    page: currentPage,
    limit,
    search: searchTerm,
    role: roleFilter,
  });

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    try {
      await updateUserMutation.mutateAsync({ id: userId, data: { role: newRole } });
      Swal.fire("Success!", `User role updated to ${newRole}`, "success");
    } catch {
      Swal.fire("Error!", "Failed to update user role", "error");
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await updateUserMutation.mutateAsync({ id: userId, data: { isActive } });
      Swal.fire("Success!", `User ${isActive ? "activated" : "deactivated"}`, "success");
    } catch {
      Swal.fire("Error!", "Failed to update user status", "error");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete user ${userEmail}?`,
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch {
        Swal.fire("Error!", "Failed to delete user", "error");
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add User Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            User Management
          </h2>
          <p
            className="text-sm mt-1"
            style={{ color: colors.text.secondary }}
          >
            Manage user accounts and permissions
          </p>
        </div>
       <button
              className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 gap-2"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse
              }}
          onClick={() => setIsAddUserModalOpen(true)}
          
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        totalUsers={usersData?.total || 0}
      />

      {isLoading && (
        <div
          className="text-center py-8"
          style={{ color: colors.text.primary }}
        >
          Loading users...
        </div>
      )}
      {error && (
        <div
          className="text-center py-8"
          style={{ color: colors.status.error }}
        >
          Error loading users
        </div>
      )}

      {!isLoading && !error && (
        <>
          <UserTable
            users={users as User[]}
            handleRoleChange={handleRoleChange}
            handleStatusChange={handleStatusChange}
            handleDeleteUser={handleDeleteUser}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
