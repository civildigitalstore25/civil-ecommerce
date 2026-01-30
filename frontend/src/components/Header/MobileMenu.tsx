import React from "react";
import {
  Phone,
  UserCheck,
  Shield,
  LogOut,
  User,
  Settings,
  Package,
} from "lucide-react";
import { headerConfig } from "./HeaderConfig";
// import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
// import MobileCategoriesMenu from "./MobileCategoriesMenu";
// import MobileShopByCategory from "./MobileShopByCategory";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  user: any;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  user,
  onLogout,
}) => {
  const { colors } = useAdminTheme();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        style={{ top: "60px" }}
      />

      {/* Mobile Menu */}
      <div
        className="lg:hidden fixed left-0 right-0 top-[60px] bottom-0 z-50 overflow-y-auto border-t shadow-lg transition-colors duration-200"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          maxHeight: "calc(100vh - 60px)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
        }}
      >
        <div className="px-2 sm:px-4 py-2 sm:py-4 space-y-4 pb-20">


          {/* Shop by Category Section - Commented for mobile view, will be used later */}
          {/* <div
          className="rounded-lg p-2 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <MobileShopByCategory />
        </div> */}

          {/* Mobile Categories Menu - Commented for mobile view, will be used later */}
          {/* <div
          className="rounded-lg p-2 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <MobileCategoriesMenu />
        </div> */}

          {/* Mobile Filters Section - Commented for mobile view, will be used later */}
          {/* <div
          className="rounded-lg p-3 space-y-3 transition-colors duration-200"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <div className="space-y-1">
            <label
              className="block text-xs font-medium"
              style={{ color: colors.text.secondary }}
            >
              Currency
            </label>
            <CurrencyDropdown className="w-full" />
          </div>
        </div> */}

          {/* Mobile navigation */}
          <div className="space-y-1">
            {/* Navigation items from headerConfig */}
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

            {/* Offers */}
            {headerConfig.offers.map((offer) => (
              <button
                key={offer.href}
                onClick={() => onNavigate(offer.href)}
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
                {offer.label}
              </button>
            ))}

            <button
              onClick={() => onNavigate('/about')}
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
              About Us
            </button>

            <button
              onClick={() => onNavigate('/category?brand=ebook')}
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
              Ebook
            </button>

            <button
              onClick={() => onNavigate('/contact')}
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
              Contact
            </button>
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
    </>
  );
};

export default MobileMenu;
