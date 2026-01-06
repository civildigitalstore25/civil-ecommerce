import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../api/userQueries";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Available permissions for admin
const AVAILABLE_PERMISSIONS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'users', label: 'Users' },
  { value: 'products', label: 'Products' },
  // { value: 'categories', label: 'Categories' },
  // { value: 'companies', label: 'Companies' },
  { value: 'orders', label: 'Orders' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'banners', label: 'Banner' },
  { value: 'coupons', label: 'Coupons' },
];

const SuperAdminCreateAdminPage: React.FC = () => {
  const { data: user } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!user || user.role !== "superadmin") {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/api/superadmin/admins`,
        { ...form, permissions: selectedPermissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Admin created successfully!");
      setForm({ email: "", password: "", fullName: "", phoneNumber: "" });
      setSelectedPermissions([]);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: '#1F5D95' }}>Create Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          {/* Permissions Section */}
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
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
            <p className="text-sm text-gray-600 mb-4">Select which sections this admin can access</p>
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

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-lg shadow hover:opacity-90 transition disabled:opacity-60"
            disabled={loading}
            style={{
              background: 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)',
              color: '#fff',
              border: 'none',
            }}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
          {success && <div className="text-green-600 mt-2 text-center">{success}</div>}
          {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default SuperAdminCreateAdminPage;
