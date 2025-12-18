import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../api/userQueries";


const AVAILABLE_PERMISSIONS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'users', label: 'Users' },
  { value: 'products', label: 'Products' },
  { value: 'categories', label: 'Categories' },
  { value: 'companies', label: 'Companies' },
  { value: 'orders', label: 'Orders' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'banners', label: 'Banner' },
  { value: 'coupons', label: 'Coupons' },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fetchAdmins = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE_URL}/api/superadmin/admins`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.admins;
};

const deleteAdmin = async (id: string) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_BASE_URL}/api/superadmin/admins/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return id;
};

const SuperAdminAdminsPage: React.FC = () => {
  const { data: user } = useUser() as { data?: { _id?: string; id?: string; role?: string } };
  const queryClient = useQueryClient();
  const [editingAdmin, setEditingAdmin] = useState<{ _id: string; email: string; permissions: string[] } | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: admins, isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/superadmin/admins/${id}/permissions`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setEditingAdmin(null);
      setSelectedPermissions([]);
    },
  });

  const handleEditPermissions = (admin: { _id: string; email: string; permissions?: string[] }) => {
    setEditingAdmin({ _id: admin._id, email: admin.email, permissions: admin.permissions || [] });
    setSelectedPermissions(admin.permissions || []);
  };

  const handleSavePermissions = () => {
    if (editingAdmin) {
      updatePermissionsMutation.mutate({ id: editingAdmin._id, permissions: selectedPermissions });
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === AVAILABLE_PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(AVAILABLE_PERMISSIONS.map(p => p.value));
    }
  };

  if (!user || user.role !== "superadmin") {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1F5D95' }}>Manage Admins</h1>
        {isLoading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 text-center">Error loading admins</div>}
        <div className="space-y-4">
          {Array.isArray(admins) && admins.length === 0 && (
            <div className="py-8 text-center text-gray-500">No admins found.</div>
          )}
          {Array.isArray(admins) && admins.map((admin: { _id?: string; fullName?: string; email?: string; permissions?: string[] }) => (
            <div key={admin._id || admin.email} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">{admin.fullName || admin.email}</h3>
                  <p className="text-sm text-gray-600">{admin.email}</p>

                  {/* Display Permissions */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Permissions:</p>
                    {admin.permissions && admin.permissions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {admin.permissions.map((permission: string) => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">No permissions assigned</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition text-sm"
                    onClick={() => handleEditPermissions(admin as { _id: string; email: string; permissions?: string[] })}
                  >
                    Edit
                  </button>
                  {user && (user._id || user.id) && admin._id && ((user._id ?? user.id) !== admin._id) && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-60 text-sm"
                      onClick={() => admin._id && deleteMutation.mutate(admin._id)}
                      disabled={(deleteMutation as any).isPending || (deleteMutation as any).isLoading}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {editingAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          onClick={() => setEditingAdmin(null)}
        >
          <div
            className="max-w-2xl w-full bg-white rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1F5D95' }}>
              Edit Permissions - {editingAdmin.email}
            </h2>

            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-700">Admin Permissions</h3>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedPermissions.length === AVAILABLE_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <label
                    key={permission.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.value)}
                      onChange={() => handlePermissionToggle(permission.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{permission.label}</span>
                  </label>
                ))}
              </div>
              {selectedPermissions.length === 0 && (
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 p-2 rounded">
                  ⚠️ No permissions selected. This admin won't be able to access any section.
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={(updatePermissionsMutation as any).isPending}
                className="px-4 py-2 rounded-lg font-semibold text-white transition disabled:opacity-60"
                style={{
                  background: 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
                }}
              >
                {(updatePermissionsMutation as any).isPending ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminAdminsPage;
