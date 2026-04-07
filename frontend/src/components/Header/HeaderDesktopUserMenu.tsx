import React from "react";
import {
  User,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Mail,
} from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

interface HeaderDesktopUserMenuProps {
  colors: ThemeColors;
  isAdminUser: boolean;
  onNavigate: (href: string) => void;
}

export const HeaderDesktopUserMenu: React.FC<HeaderDesktopUserMenuProps> = ({
  colors,
  isAdminUser,
  onNavigate,
}) => {
  return (
    <div className="hidden sm:block relative user-dropdown-group group">
      <button
        type="button"
        className="flex items-center hover:opacity-80 px-1 lg:px-2"
        style={{ color: colors.text.secondary }}
      >
        <User className="w-5 h-5 lg:w-5 lg:h-5" />
        <ChevronDown className="w-3 h-3 ml-1" />
      </button>
      <div
        className="user-dropdown-panel absolute right-0 mt-0 w-48 rounded-md shadow-lg border py-2 z-50 hidden group-hover:block"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        {isAdminUser && (
          <button
            type="button"
            onClick={() => onNavigate("/admin-dashboard")}
            className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.background.secondary;
              e.currentTarget.style.color = colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <Settings className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => onNavigate("/profile")}
          className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("/my-orders")}
          className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <Package className="w-4 h-4" />
          <span>My Orders</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("/my-enquiries")}
          className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <Mail className="w-4 h-4" />
          <span>My Enquiries</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate("/logout")}
          className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
          style={{ color: colors.text.secondary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.secondary;
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
