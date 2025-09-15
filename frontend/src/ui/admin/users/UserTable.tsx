import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { User } from "../../../api/types/userTypes";
import FormButton from "../../../components/Button/FormButton";

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
  const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});

  const handleRoleSelect = (userId: string, newRole: string) => {
    setEditedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left pl-14 py-3 px-4">User</th>
              <th className="text-left py-3 pl-18 px-4">Email</th>
              <th className="text-left py-3 pl-8 px-4">Role</th>
              <th className="text-left py-3 px-4">Joined</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.fullName || "No name"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.phoneNumber || "No phone"}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4 text-gray-900">{user.email}</td>

                {/* Role Select + Update Button */}
                <td className="py-4 px-4 flex items-center gap-2">
                  <select
                    value={editedRoles[user._id] || user.role}
                    onChange={(e) => handleRoleSelect(user._id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {editedRoles[user._id] && editedRoles[user._id] !== user.role && (
                    <FormButton
                      onClick={() =>
                        handleRoleChange(user._id, editedRoles[user._id] as "user" | "admin")
                      }
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Update
                    </FormButton>
                  )}
                </td>

                

                {/* Joined */}
                <td className="py-4 px-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id, user.email)}
                    className="text-red-500 hover:text-red-700 p-1"
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
