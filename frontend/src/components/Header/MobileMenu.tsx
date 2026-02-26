import React from "react";
import { LogOut, User, Package } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import ProductSearchBar from "./ProductSearchBar";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  user?: any;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLogout,
  user,
}) => {
  const { colors } = useAdminTheme();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        style={{ top: "60px" }}
      />

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
          <ProductSearchBar onSearch={onClose} />

          <div className="space-y-1">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate("/profile")}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => onNavigate("/my-orders")}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("/login")}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => onNavigate("/signup")}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-all duration-200 hover:opacity-80"
                  style={{ color: colors.text.secondary }}
                >
                  <User className="w-5 h-5" />
                  <span>Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
