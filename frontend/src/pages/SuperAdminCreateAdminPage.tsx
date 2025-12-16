import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../api/userQueries";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SuperAdminCreateAdminPage: React.FC = () => {
  const { data: user } = useUser();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!user || user.role !== "superadmin") {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Admin created successfully!");
      setForm({ email: "", password: "", fullName: "", phoneNumber: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
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
