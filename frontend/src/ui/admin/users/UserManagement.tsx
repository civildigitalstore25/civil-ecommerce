import React, { useEffect, useState } from "react";
import { useUsers, useUpdateUser, useDeleteUser } from "../../../api/userApi";
import type { User } from "../../../api/types/userTypes";
import UserFilters from "./UserFilter";
import AddUserModal from "./AddUserModal";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";
import UserManagementToolbar from "./UserManagementToolbar";
import UserRegistrationDateFilter from "./UserRegistrationDateFilter";
import {
  swalConfirmDestructive,
  swalConfirmSimple,
  swalError,
  swalSuccess,
  swalSuccessBrief,
} from "../../../utils/swal";
import { filterByRegistrationDate } from "../../../utils/filterByRegistrationDate";
import { useUserManagementExport } from "./useUserManagementExport";
import UserManagementUsersPanel from "./UserManagementUsersPanel";

const UserManagement: React.FC = () => {
  const { colors } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
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
    limit: pageSize,
    search: searchTerm,
    role: roleFilter,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchTerm, roleFilter, dateFilter, customStartDate, customEndDate]);

  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersData?.users || [];
  const totalPages = usersData?.totalPages || 1;

  const filteredUsers = filterByRegistrationDate(
    users,
    dateFilter,
    customStartDate,
    customEndDate,
  );

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin" | "superadmin",
  ) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        data: { role: newRole },
      });
      await swalSuccess(`User role updated to ${newRole}`, "Success!");
    } catch {
      await swalError("Failed to update user role", "Error!");
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const ok = await swalConfirmSimple(`Delete user ${userEmail}?`);
    if (!ok) return;
    try {
      await deleteUserMutation.mutateAsync(userId);
      await swalSuccess("User has been deleted.", "Deleted!");
    } catch {
      await swalError("Failed to delete user", "Error!");
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
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    const count = selectedUsers.length;
    const ids = [...selectedUsers];
    const ok = await swalConfirmDestructive({
      text: `You are about to delete ${count} user(s). This action cannot be undone.`,
      confirmButtonText: "Yes, delete them!",
    });
    if (!ok) return;
    ids.forEach((id) => {
      deleteUserMutation.mutate(id);
    });
    setSelectedUsers([]);
    await swalSuccessBrief("Deleted!", `${count} user(s) have been deleted.`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  };

  const { exportExcel, exportJSON } = useUserManagementExport(searchTerm, roleFilter);

  return (
    <div
      className="space-y-6 w-full transition-colors duration-200"
      style={{
        background: colors.background.secondary,
        boxShadow: "none",
        padding: 0,
      }}
    >
      <UserManagementToolbar
        colors={colors}
        selectedCount={selectedUsers.length}
        onBulkDelete={handleBulkDelete}
        onAddUser={() => setIsAddUserModalOpen(true)}
        exportOpen={exportOpen}
        setExportOpen={setExportOpen}
        onExportExcel={exportExcel}
        onExportJSON={exportJSON}
      />

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        clearFilters={clearFilters}
        totalUsers={usersData?.total || 0}
      />

      <UserRegistrationDateFilter
        colors={colors}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customStartDate={customStartDate}
        onCustomStartChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndChange={setCustomEndDate}
      />

      <UserManagementUsersPanel
        colors={colors}
        isLoading={isLoading}
        error={error}
        filteredUsers={filteredUsers as User[]}
        selectedUsers={selectedUsers}
        handleRoleChange={handleRoleChange}
        handleDeleteUser={handleDeleteUser}
        handleSelectAll={handleSelectAll}
        handleSelectUser={handleSelectUser}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
