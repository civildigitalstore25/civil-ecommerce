// ui/admin/AdminDashboard.tsx
import React, { useState } from "react";
import {
  BarChart3,
  Package,
  Tag,
  Building2,
  ShoppingCart,
  Users,
  Image,
  TicketPercent,
  MessageSquare,
} from "lucide-react";
import Dashboard from "./Dashboard";
import Products from "./products/Products";
import Categories from "./Categories";
import Companies from "./Companies";
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
  | "categories"
  | "companies"
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

  // Show nothing until user is loaded
  if (isLoading) return null;

  // Build menu items, add admin-management only for superadmin
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "banner", label: "Banner", icon: Image },
    { id: "coupons", label: "Coupons", icon: TicketPercent },
    // Only superadmin sees Admin Management menu
    ...(user?.role === "superadmin"
      ? [{ id: "admin-management", label: "Admin Management", icon: Users }]
      : []),
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserManagement />;
      case "products":
        return <Products />;
      case "categories":
        return <Categories />;
      case "companies":
        return <Companies />;
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