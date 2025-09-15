import React, { useState } from "react";
import { useUsers, useUpdateUser, useDeleteUser } from "../../../api/userApi";
import type { User } from "../../../api/types/userTypes";
import Swal from "sweetalert2";
import UserFilters from "./UserFilter";
import UserTable from "./UserTable";
import Pagination from "./Pagination";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

      {isLoading && <div className="text-center py-8">Loading users...</div>}
      {error && <div className="text-center py-8 text-red-500">Error loading users</div>}

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
    </div>
  );
};

export default UserManagement;
