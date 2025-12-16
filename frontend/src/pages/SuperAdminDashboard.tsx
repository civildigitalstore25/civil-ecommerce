import React from "react";
import { useUser } from "../api/userQueries";

const SuperAdminDashboard: React.FC = () => {
  const { data: user } = useUser();

  if (!user || user.role !== "superadmin") {
    return <div className="p-8 text-center text-red-600 font-bold">Access denied: Superadmin only</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Superadmin Dashboard</h1>
      <p>Welcome, {user.fullName || user.email}!</p>
      {/* Add superadmin-only features here */}
      <div className="mt-6 p-4 bg-blue-100 rounded">System settings, user management, and more coming soon.</div>
    </div>
  );
};

export default SuperAdminDashboard;
