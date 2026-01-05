// ui/admin/AdminDashboard.tsx
import React, { useState } from "react";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Image,
  TicketPercent,
  MessageSquare,
} from "lucide-react";
import Dashboard from "./Dashboard";
import Products from "./products/Products";
import Orders from "./Orders";

import UserManagement from "./users/UserManagement";

import { useAdminTheme } from "../../contexts/AdminThemeContext";
import Banner from "./Banner";
import Coupons from "../admin/coupons/Coupons";
import Reviews from "./Reviews";
import SuperAdminAdminManagement from "./SuperAdminAdminManagement";
import { useAuth } from "../../api/auth";

type MenuType =
  | "dashboard"
  | "users"
  | "products"
  // Removed "categories" and "companies"
  | "orders"
  | "settings"
  | "banner"
  | "coupons"
  | "reviews"
  | "admin-management";


const AdminDashboardContent: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuType>("dashboard");
  const { colors } = useAdminTheme();
  const { user, isLoading } = useAuth();


  // Helper function to check if admin has permission
  const hasPermission = (permission: string): boolean => {
    // Superadmin has all permissions
    if (user?.role === "superadmin") return true;
    // Check if admin has the specific permission
    return user?.permissions?.includes(permission) || false;
  };

  // Build menu items based on permissions
  const allMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, permission: "dashboard" },
    { id: "users", label: "Users", icon: Users, permission: "users" },
    { id: "products", label: "Products", icon: Package, permission: "products" },
    // Removed Categories and Companies menu items
    { id: "orders", label: "Orders", icon: ShoppingCart, permission: "orders" },
    { id: "reviews", label: "Reviews", icon: MessageSquare, permission: "reviews" },
    { id: "banner", label: "Banner", icon: Image, permission: "banners" },
    { id: "coupons", label: "Coupons", icon: TicketPercent, permission: "coupons" },
  ];

  // Filter menu items based on permissions
  const menuItems = allMenuItems.filter(item => hasPermission(item.permission));

  // Add admin management only for superadmin
  if (user?.role === "superadmin") {
    menuItems.push({ id: "admin-management", label: "Admin Management", icon: Users, permission: "admin-management" });
  }

  // Auto-select first available menu if current activeMenu is not accessible
  React.useEffect(() => {
    const currentMenuItem = menuItems.find(item => item.id === activeMenu);
    if (!currentMenuItem && menuItems.length > 0) {
      setActiveMenu(menuItems[0].id as MenuType);
    }
  }, [user?.permissions, activeMenu, menuItems]);

  // Show nothing until user is loaded (keep after hooks)
  if (isLoading) return null;

  const renderContent = () => {
    // Check permission before rendering content
    if (activeMenu !== "admin-management" && !hasPermission(activeMenu)) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 font-bold text-xl">Access Denied</p>
          <p className="text-gray-600 mt-2">You don't have permission to access this section.</p>
        </div>
      );
    }

    switch (activeMenu) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserManagement />;
      case "products":
        return <Products />;
      // Removed Categories and Companies content
      case "orders":
        return <Orders />;
      case "reviews":
        return <Reviews />;
      case "banner":
        return <Banner />;
      case "coupons":
        return <Coupons />;
      case "admin-management":
        return user?.role === "superadmin" ? <SuperAdminAdminManagement /> : null;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <div
        className="shadow-xl transition-colors duration-200"

      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1
                className="text-2xl font-bold font-poppins transition-colors duration-200"
                style={{ color: colors.text.primary }}
              >
                Admin Dashboard
              </h1>
              <p
                className="transition-colors duration-200 font-lato"
                style={{ color: colors.text.secondary }}
              >
                Manage your e-commerce platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id as MenuType)}
                  className="flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap font-medium"
                  style={{
                    borderBottom: isActive
                      ? `2px solid ${colors.text.primary}`
                      : `2px solid transparent`,
                    color: isActive
                      ? colors.text.primary
                      : colors.text.secondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div
          className="p-4 md:p-8 transition-colors duration-200 w-full"
          style={{
            background: colors.background.secondary,
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return <AdminDashboardContent />;
};

export default AdminDashboard;