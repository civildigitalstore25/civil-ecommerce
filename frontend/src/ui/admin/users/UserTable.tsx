import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { User } from "../../../api/types/userTypes";
import FormButton from "../../../components/Button/FormButton";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface Props {
  users: User[];
  handleRoleChange: (userId: string, newRole: "user" | "admin") => void;
  handleDeleteUser: (userId: string, userEmail: string) => void;
}

const UserTable: React.FC<Props> = ({
  users,
  handleRoleChange,
  handleDeleteUser,
}) => {
  const { colors, theme } = useAdminTheme();
  const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});

  const handleRoleSelect = (userId: string, newRole: string) => {
    setEditedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  return (
    <div
      className="overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className="border-b transition-colors duration-200"

          >
            <tr>
              <th
                className="text-left pl-14 py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                User
              </th>
              <th
                className="text-left py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                Email
              </th>
              <th
                className="text-left py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                Phone Number
              </th>
              <th
                className="text-left py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                Role
              </th>
              <th
                className="text-left py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                Joined
              </th>
              <th
                className="text-left py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y transition-colors duration-200"
            style={{ borderColor: colors.border.secondary }}
          >
            {users.map((user) => (
              <tr
                key={user._id}
                className="transition-colors duration-200"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* User Name */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"

                    >
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: colors.text.primary }}
                      >
                        {user.fullName || "No name"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-4" style={{ color: colors.text.primary }}>
                  {user.email}
                </td>

                {/* Phone Number */}
                <td className="py-4 px-4" style={{ color: colors.text.primary }}>
                  {user.phoneNumber ? user.phoneNumber : "N/A"}
                </td>

                {/* Role Select + Update Button */}
                <td className="py-4 px-4 flex items-center gap-2">
                  <select
                    value={editedRoles[user._id] || user.role}
                    onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                    className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 gap-2 shadow-md"
                    style={{
                      background: '#fff',
                      color: 'black',
                      border: `1px solid ${colors.border.primary}`,
                      minWidth: 80,
                    }}
                  >
                    <option value="user" style={{ color: 'black' }}>User</option>
                    <option value="admin" style={{ color: 'black' }}>Admin</option>
                  </select>
                  {editedRoles[user._id] &&
                    editedRoles[user._id] !== user.role && (
                      <FormButton
                        onClick={() =>
                          handleRoleChange(
                            user._id,
                            editedRoles[user._id] as "user" | "admin",
                          )
                        }
                        className="text-sm transition-colors duration-200 border rounded px-2 py-1 ml-1"
                        style={{
                          color: theme === "light" ? "#fff" : colors.text.primary,
                          background: theme === "light"
                            ? 'linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)'
                            : colors.background.tertiary,
                          borderColor: colors.interactive.primary,
                        }}
                      >
                        Update
                      </FormButton>
                    )}
                </td>

                {/* Joined */}
                <td
                  className="py-4 px-4 text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id, user.email)}
                    className="p-1 transition-colors duration-200"
                    style={{ color: colors.status.error }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
