import React, { useState } from "react";
import SuperAdminAdminsPage from "../../pages/SuperAdminAdminsPage";
import SuperAdminCreateAdminPage from "../../pages/SuperAdminCreateAdminPage";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const SuperAdminAdminManagement: React.FC = () => {
  const [tab, setTab] = useState<"list" | "create">("list");
  const { colors } = useAdminTheme();
  
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex overflow-hidden rounded-lg border shadow"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <button
            className="px-8 py-2 text-base font-semibold transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor:
                tab === "list" ? colors.interactive.primary : colors.background.primary,
              color: tab === "list" ? colors.text.inverse : colors.text.primary,
              borderRight: `1px solid ${colors.border.primary}`,
            }}
            onClick={() => setTab("list")}
          >
            Admin List
          </button>
          <button
            className="px-8 py-2 text-base font-semibold transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor:
                tab === "create" ? colors.interactive.primary : colors.background.primary,
              color: tab === "create" ? colors.text.inverse : colors.text.primary,
            }}
            onClick={() => setTab("create")}
          >
            Create Admin
          </button>
        </div>
      </div>
      <div
        className="rounded-lg border p-6 shadow"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        {tab === "list" ? <SuperAdminAdminsPage /> : <SuperAdminCreateAdminPage />}
      </div>
    </div>
  );
};

export default SuperAdminAdminManagement;
