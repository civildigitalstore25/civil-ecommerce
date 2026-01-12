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
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const limit = 10;
  const [exportOpen, setExportOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  // Filter users by date range
  const getFilteredUsers = () => {
    if (dateFilter === "all") return users;

    const now = new Date();
    let startDate: Date | null = null;

    if (dateFilter === "last-year") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    } else if (dateFilter === "last-month") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (dateFilter === "last-week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === "custom" && customStartDate) {
      startDate = new Date(customStartDate);
    }

    const endDate = dateFilter === "custom" && customEndDate ? new Date(customEndDate) : now;

    return users.filter((user: User) => {
      const userDate = new Date(user.createdAt);
      if (!startDate) return true;
      return userDate >= startDate && userDate <= endDate;
    });
  };

  const filteredUsers = getFilteredUsers();

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

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u: User) => u._id));
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedUsers.length} user(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedUsers.forEach(id => {
          deleteUserMutation.mutate(id);
        });
        setSelectedUsers([]);
        Swal.fire({
          title: "Deleted!",
          text: `${selectedUsers.length} user(s) have been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
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
    <div
      className="space-y-6 w-full transition-colors duration-200"
      style={{
        background: colors.background.secondary,
        boxShadow: 'none',
        padding: 0,
      }}
    >
      {/* Header with Add User Button */}
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
          {selectedUsers.length > 0 && (
            <button
              className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
              onClick={handleBulkDelete}
            >
              <Plus className="h-4 w-4" />
              Delete Selected ({selectedUsers.length})
            </button>
          )}
          <button
            className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 gap-2 shadow-md"
            style={{
              background: '#00BEF5',
              color: colors.text.inverse,
              border: 'none',
            }}
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
          <div className="relative">
            <button
              className="px-4 py-2 rounded-lg flex items-center font-medium transition-colors duration-200 gap-2 border"
              style={{
                background: colors.background.primary,
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
      </div>

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        clearFilters={clearFilters}
        totalUsers={usersData?.total || 0}
      />

      {/* Date Filter Section */}
      <div
        className="rounded-lg p-4 border"
        style={{
          background: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
              Filter by Registration Date
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {dateFilter === "custom" && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                    color: colors.text.primary,
                  }}
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>

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
            users={filteredUsers as User[]}
            handleRoleChange={handleRoleChange}
            handleDeleteUser={handleDeleteUser}
            selectedUsers={selectedUsers}
            handleSelectAll={handleSelectAll}
            handleSelectUser={handleSelectUser}
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
