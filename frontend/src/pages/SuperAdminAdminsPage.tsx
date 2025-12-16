import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "../api/userQueries";

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
  const { data: admins, isLoading, error } = useQuery({
    queryKey: ["admins"],
    queryFn: fetchAdmins,
  });
  const mutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  if (!user || user.role !== "superadmin") {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1F5D95' }}>Manage Admins</h1>
        {isLoading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600 text-center">Error loading admins</div>}
        <ul className="divide-y divide-gray-200">
          {Array.isArray(admins) && admins.length === 0 && <li className="py-4 text-center text-gray-500">No admins found.</li>}
          {Array.isArray(admins) && admins.map((admin: { _id?: string; fullName?: string; email?: string }) => (
            <li key={admin._id || admin.email} className="py-4 flex items-center justify-between">
              <span className="font-medium text-gray-800">{admin.fullName || admin.email}</span>
              {/* Prevent superadmin from deleting themselves */}
              {user && (user._id || user.id) && admin._id && ((user._id ?? user.id) !== admin._id) && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-60"
                  onClick={() => admin._id && mutation.mutate(admin._id)}
                  disabled={(mutation as any).isPending || (mutation as any).isLoading}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuperAdminAdminsPage;
