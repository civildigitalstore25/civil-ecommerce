import React, { useState, useRef, useEffect } from "react";
import {
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
  ChevronDown,
} from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import DesktopNavigation from "./DesktopNavigation";
import AuthDropdown from "./AuthDropdown";
import MobileMenu from "./MobileMenu";
import AdminDashboard from "../../ui/admin/AdminDashboard";
// Dropdowns now imported only in DesktopNavigation
import { useNavigate } from "react-router-dom";
import { clearAuth, isAdmin } from "../../utils/auth";
import { useUser, useUserInvalidate, useLogout } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import AdminThemeToggle from "../ThemeToggle/AdminThemeToggle";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
// Use PNG logo from public folder
const lightLogo = "/softlogo.png";
const darkLogo = "/whitelogo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Only keep dropdown state for user/auth (not desktop nav)
  const [openDropdown, setOpenDropdown] = useState<null | 'auth' | 'user'>(null);
  // const [searchQuery, setSearchQuery] = useState("");
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const autodeskButtonRef = useRef<HTMLButtonElement>(null);
  const microsoftButtonRef = useRef<HTMLButtonElement>(null);
  const adobeButtonRef = useRef<HTMLButtonElement>(null);
  const antivirusButtonRef = useRef<HTMLButtonElement>(null);
  const allCategoriesButtonRef = useRef<HTMLButtonElement>(null);

  const { data: user } = useUser();
  const invalidateUser = useUserInvalidate();
  const navigate = useNavigate();
  const { getItemCount } = useCartContext();
  const { colors, theme } = useAdminTheme();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  // Only for user/auth dropdowns
  const handleDropdownOpen = (key: typeof openDropdown) => setOpenDropdown(key);
  const handleDropdownClose = () => setOpenDropdown(null);

  // const handleSearch = () => {
  //   if (searchQuery.trim()) {
  //     navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  //   }
  // };

  // const handleKeyPress = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter") {
  //     handleSearch();
  //   }
  // };

  const handleNavigation = (href: string) => {
    if (href === "/admin-login") {
      setShowAdminDashboard(true);
    } else if (href === "/") {
      setShowAdminDashboard(false);
      navigate("/");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === "/logout") {
      handleLogout();
    } else {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
    // No longer needed: all dropdowns handled by CSS except user/auth
  };

  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        invalidateUser();
        navigate("/");
        window.location.reload();
      },
      onError: () => {
        clearAuth();
        invalidateUser();
        navigate("/");
        window.location.reload();
      },
    });
  };

  if (showAdminDashboard) {
    return (
      <div>
        <header className="bg-white shadow-sm border-b border-gray-200 w-full">
          <div className="w-full">
            <div className="flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 lg:px-8">
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={() => handleNavigation(headerConfig.logo.href)}
                  className="flex items-center"
                >
                  <img
                    src={theme === "dark" ? darkLogo : lightLogo}
                    alt="Logo"
                    className="h-8 sm:h-10 md:h-12 max-h-12 w-auto object-contain"
                  />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">
                    Admin Panel Active
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowAdminDashboard(false)}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  Exit Admin
                </button>
              </div>
            </div>
          </div>
        </header>
        <AdminDashboard />
      </div>
    );
  }

  return (
    <header
      className="shadow-sm border-b w-full transition-colors duration-200 fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      {/* Main header content */}
      <div className="w-full">
        <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 lg:px-8">
          {/* Logo flush left */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center"
            >
              <img
                src={theme === "dark" ? darkLogo : lightLogo}
                alt="Logo"
                className="h-10 sm:h-10 md:h-12 max-h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Center section - Desktop */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
            {/* Desktop Navigation */}
            <DesktopNavigation
              onNavigate={handleNavigation}
              allCategoriesButtonRef={allCategoriesButtonRef}
              autodeskButtonRef={autodeskButtonRef}
              microsoftButtonRef={microsoftButtonRef}
              adobeButtonRef={adobeButtonRef}
              antivirusButtonRef={antivirusButtonRef}
              hideHomeMenu
            />


          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 pr-2 lg:pr-4 min-h-[56px]">
            {/* Cart */}
            <button
              onClick={() => handleNavigation("/cart")}
              className="relative flex items-center hover:opacity-80 px-1 lg:px-2"
              style={{ color: colors.text.secondary }}
            >
              <ShoppingCart className="w-5 h-5 lg:w-5 lg:h-5" />
              {getItemCount() > 0 && (
                <span
                  className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 text-xs rounded-full w-5 h-5 lg:w-5 lg:h-5 flex items-center justify-center"
                  style={{
                    backgroundColor: colors.interactive.primary,
                    color: colors.text.inverse,
                  }}
                >
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* User dropdown or Auth dropdown */}
            {user ? (
              <div className="hidden sm:block relative user-dropdown-group group">
                <button
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
                  {isAdmin(user) && (
                    <button
                      onClick={() => handleNavigation("/admin-dashboard")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.background.secondary;
                        e.currentTarget.style.color = colors.interactive.primary;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = colors.background.secondary;
                      e.currentTarget.style.color = colors.interactive.primary;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => handleNavigation("/my-orders")}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = colors.background.secondary;
                      e.currentTarget.style.color = colors.interactive.primary;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }}
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => handleNavigation("/logout")}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm transition-colors duration-200"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = colors.background.secondary;
                      e.currentTarget.style.color = colors.interactive.primary;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block relative auth-dropdown-group"
                onMouseEnter={() => handleDropdownOpen('auth')}
                onMouseLeave={handleDropdownClose}
              >
                <button
                  className="flex items-center hover:opacity-80 px-1 lg:px-2"
                  style={{ color: colors.text.secondary }}
                >
                  <User className="w-5 h-5 lg:w-5 lg:h-5" />
                </button>
                <AuthDropdown
                  isOpen={openDropdown === 'auth'}
                  onClose={handleDropdownClose}
                  onNavigate={handleNavigation}
                />
              </div>
            )}

            {/* Currency Selector */}
            <CurrencyDropdown className="hidden sm:block" compact />

            {/* Theme Toggle - Always visible */}
            <span className="flex items-center" style={{ fontSize: 18, padding: '0 2px' }}>
              <AdminThemeToggle iconSize={18} />
            </span>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 sm:p-2 rounded-md hover:opacity-80 ml-1"
              style={{ color: colors.text.secondary }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-6 h-6 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigation}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Overlay to close dropdowns */}
      {/* No overlay for CSS hover dropdowns */}
    </header>
  );
};

export default Header;
