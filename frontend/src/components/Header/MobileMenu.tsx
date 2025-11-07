import React from "react";
import {
  Search,
  Phone,
  UserCheck,
  Shield,
  LogOut,
  User,
  Settings,
  Package,
} from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
import MobileCategoriesMenu from "./MobileCategoriesMenu";
import MobileShopByCategory from "./MobileShopByCategory";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface MobileMenuProps {
  isOpen: boolean;
  searchQuery: string;
  onClose: () => void;
  onSearch: () => void;
  onSearchChange: (query: string) => void;
  onSearchKeyPress: (e: React.KeyboardEvent) => void;
  onNavigate: (href: string) => void;
  user: any;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  searchQuery,
  onSearch,
  onSearchChange,
  onSearchKeyPress,
  onNavigate,
  user,
  onLogout,
}) => {
  const { colors } = useAdminTheme();

  if (!isOpen) return null;

  return (
    <div
      className="lg:hidden border-t shadow-lg transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="px-2 sm:px-4 py-2 sm:py-4 space-y-4">
        {/* Mobile search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyPress={onSearchKeyPress}
            placeholder={headerConfig.search.placeholder}
            className="w-full pl-4 pr-12 py-2 sm:py-3 text-sm border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.primary;
            }}
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md hover:opacity-80 transition-all duration-200"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Shop by Category Section */}
        <div
          className="rounded-lg p-2 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <MobileShopByCategory />
        </div>

        {/* Mobile Categories Menu */}
        <div
          className="rounded-lg p-2 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <MobileCategoriesMenu />
        </div>

        {/* Mobile Filters Section */}
        <div
          className="rounded-lg p-3 space-y-3 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          {/* Currency Selector - Mobile */}
          <div className="space-y-1">
            <label
              className="block text-xs font-medium"
              style={{ color: colors.text.secondary }}
            >
              Currency
            </label>
            <CurrencyDropdown className="w-full" />
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="space-y-1">
          {headerConfig.navigation.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className="block w-full text-left px-3 py-2 sm:py-3 text-base rounded-md transition-all duration-200 hover:opacity-80"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.interactive.primary;
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  colors.background.secondary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.text.secondary;
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User section or Auth Options */}
        {user ? (
          <div
            className="pt-2 border-t transition-colors duration-200"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="space-y-2">
              <div
                className="px-3 py-2 text-sm"
                style={{ color: colors.text.secondary }}
              >
                Signed in as <span className="font-medium">{user.email}</span>
              </div>
              {user.role === "admin" && (
                <button
                  onClick={() => onNavigate("/admin-dashboard")}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.interactive.primary;
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      colors.background.secondary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.text.secondary;
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <Settings className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              <button
                onClick={() => onNavigate("/profile")}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => onNavigate("/my-orders")}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <Package className="w-5 h-5" />
                <span>My Orders</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.status.error;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className="pt-2 border-t transition-colors duration-200"
            style={{ borderColor: colors.border.primary }}
          >
            <div className="space-y-2">
              <button
                onClick={() => onNavigate(headerConfig.auth.customer.href)}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <UserCheck className="w-5 h-5" />
                <span>{headerConfig.auth.customer.label}</span>
              </button>
              <button
                onClick={() => onNavigate(headerConfig.auth.admin.href)}
                className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <Shield className="w-5 h-5" />
                <span>{headerConfig.auth.admin.label}</span>
              </button>
            </div>
          </div>
        )}

        {/* Mobile contact */}
        {headerConfig.contact && (
          <div
            className="px-3 py-2 sm:py-3 border-t transition-colors duration-200"
            style={{ borderColor: colors.border.primary }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
              style={{ color: colors.text.secondary }}
            >
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">Need help?</span>
              </div>
              <a
                href={headerConfig.contact.phoneHref}
                className="font-semibold text-sm sm:text-base hover:opacity-80 transition-opacity duration-200"
                style={{ color: colors.interactive.primary }}
              >
                {headerConfig.contact.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
