import React, { useState } from "react";
import { useUsers, useUpdateUser, useDeleteUser, userApi } from "../../../api/userApi";
import type { User } from "../../../api/types/userTypes";
import Swal from "sweetalert2";
import { Plus, ChevronDown } from "lucide-react";
import UserFilters from "./UserFilter";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import AddUserModal from "./AddUserModal";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

const UserManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const limit = 10;
  const [exportOpen, setExportOpen] = useState(false);

  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({
    page: currentPage,
    limit,
    search: searchTerm,
    role: roleFilter,
  });

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin",
  ) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        data: { role: newRole },
      });
      Swal.fire("Success!", `User role updated to ${newRole}`, "success");
    } catch {
      Swal.fire("Error!", "Failed to update user role", "error");
    }
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await updateUserMutation.mutateAsync({ id: userId, data: { isActive } });
      Swal.fire(
        "Success!",
        `User ${isActive ? "activated" : "deactivated"}`,
        "success",
      );
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


  // Export handlers
  const fetchAllUsers = async () => {
    // Use current filters for export
    // Fetch with search and role filters only
    const resp = await userApi.getUsers({
      page: 1,
      limit: 100000,
      search: searchTerm,
      role: roleFilter,
    });
    let users = resp.users || [];
    // Filter by status on frontend if needed
    if (statusFilter === "Active") {
      users = users.filter((u) => u.isActive);
    } else if (statusFilter === "Inactive") {
      users = users.filter((u) => !u.isActive);
    }
    return users.map((u) => ({
      id: u._id,
      fullName: u.fullName || "",
      email: u.email,
      phoneNumber: u.phoneNumber || "",
      role: u.role,
      isActive: u.isActive ? "Active" : "Inactive",
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
  };

  const handleExportExcel = async () => {
    try {
      const data = await fetchAllUsers();
      const XLSX = (await import("xlsx")) as any;
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");
      XLSX.writeFile(wb, `users_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.xlsx`);
    } catch (err) {
      Swal.fire("Error", "Failed to export users", "error");
    }
  };

  const handleExportJSON = async () => {
    try {
      const data = await fetchAllUsers();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      Swal.fire("Error", "Failed to export users", "error");
    }
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
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
            Manage user accounts and permissions
          </p>
        </div>
        <button
          className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 gap-2"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse,
          }}
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
        <div className="relative ml-3">
          <button
            className="px-4 py-2 rounded-lg flex items-center font-medium transition-colors duration-200 gap-2 border"
            style={{
              backgroundColor: colors.background.secondary,
              color: colors.text.primary,
              border: `1px solid ${colors.interactive.primary}`,
              minWidth: 110,
            }}
            onClick={() => setExportOpen((v) => !v)}
            type="button"
          >
            Export <ChevronDown className="h-4 w-4" />
          </button>
          {exportOpen && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg z-10"
              style={{ background: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
            >
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                style={{ color: colors.text.primary }}
                onClick={async () => {
                  await handleExportExcel();
                  setExportOpen(false);
                }}
                type="button"
              >
                Export to Excel
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                style={{ color: colors.text.primary }}
                onClick={async () => {
                  await handleExportJSON();
                  setExportOpen(false);
                }}
                type="button"
              >
                Export to JSON
              </button>
            </div>
          )}
        </div>
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
