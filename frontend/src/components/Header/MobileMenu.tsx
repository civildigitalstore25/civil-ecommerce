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
          <div className="space-y-1">
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
      </div>
    </>
  );
};

export default MobileMenu;
