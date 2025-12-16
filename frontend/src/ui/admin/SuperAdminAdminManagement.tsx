import React, { useState } from "react";
import SuperAdminAdminsPage from "../../pages/SuperAdminAdminsPage";
import SuperAdminCreateAdminPage from "../../pages/SuperAdminCreateAdminPage";

const SuperAdminAdminManagement: React.FC = () => {
  const [tab, setTab] = useState<"list" | "create">("list");
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <button
            className={`px-8 py-2 font-semibold focus:outline-none transition-colors duration-200 text-base ${
              tab === "list"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            style={{ borderRight: '1px solid #e5e7eb' }}
            onClick={() => setTab("list")}
          >
            Admin List
          </button>
          <button
            className={`px-8 py-2 font-semibold focus:outline-none transition-colors duration-200 text-base ${
              tab === "create"
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setTab("create")}
          >
            Create Admin
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {tab === "list" ? <SuperAdminAdminsPage /> : <SuperAdminCreateAdminPage />}
      </div>
    </div>
  );
};

export default SuperAdminAdminManagement;
