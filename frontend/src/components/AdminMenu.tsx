import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../api/userQueries";

const AdminMenu: React.FC = () => {
  const { data: user } = useUser();
  if (!user || (user.role !== "superadmin" && user.role !== "admin")) return null;
  
  return (
    <nav className="mb-6">
      <h2 className="text-lg font-bold mb-2">{user.role === "superadmin" ? "Superadmin" : "Admin"} Menu</h2>
      <ul className="space-y-2">
        {user.role === "superadmin" && (
          <>
            <li>
              <Link to="/superadmin" className="text-blue-600 hover:underline">
                Superadmin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/superadmin/admins" className="text-blue-600 hover:underline">
                Manage Admins
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to="/admin/blogs" className="text-blue-600 hover:underline">
            Manage Blogs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminMenu;
