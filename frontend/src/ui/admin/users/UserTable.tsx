import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { User } from "../../../api/types/userTypes";
import FormButton from "../../../components/Button/FormButton";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface Props {
  users: User[];
  handleRoleChange: (userId: string, newRole: "user" | "admin") => void;
  handleStatusChange: (userId: string, isActive: boolean) => void;
  handleDeleteUser: (userId: string, userEmail: string) => void;
}

const UserTable: React.FC<Props> = ({
  users,
  handleRoleChange,
  handleDeleteUser,
}) => {
  const { colors } = useAdminTheme();
  const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});

  const handleRoleSelect = (userId: string, newRole: string) => {
    setEditedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  return (
    <div
      className="rounded-xl shadow-xl border overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead
            className="border-b transition-colors duration-200"
            style={{
              backgroundColor: colors.background.tertiary,
              borderBottomColor: colors.border.primary,
            }}
          >
            <tr>
              <th
                className="text-left pl-14 py-3 px-4"
                style={{ color: colors.text.primary }}
              >
                User
              </th>
              <th
                className="text-left py-3 pl-18 px-4"
                style={{ color: colors.text.primary }}
              >
                Email
              </th>
              <th
                className="text-left py-3 pl-8 px-4"
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
                  e.currentTarget.style.backgroundColor =
                    colors.background.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.background.tertiary }}
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
                      <div
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {user.phoneNumber || "No phone"}
                      </div>
                    </div>
                  </div>
                </td>

                <td
                  className="py-4 px-4"
                  style={{ color: colors.text.primary }}
                >
                  {user.email}
                </td>

                {/* Role Select + Update Button */}
                <td className="py-4 px-4 flex items-center gap-2">
                  <select
                    value={editedRoles[user._id] || user.role}
                    onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.tertiary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
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
                        className="text-sm transition-colors duration-200"
                        style={{
                          color: colors.interactive.primary,
                          backgroundColor: "transparent",
                          border: "none",
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
