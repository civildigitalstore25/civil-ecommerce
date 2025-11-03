import React, { useState, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import DesktopNavigation from "./DesktopNavigation";
import AuthDropdown from "./AuthDropdown";
import MobileMenu from "./MobileMenu";
import AdminDashboard from "../../ui/admin/AdminDashboard";
import AutodeskDropdown from "./AutodeskDropdown";
import MicrosoftDropdown from "./MicrosoftDropdown";
import AdobeDropdown from "./AdobeDropdown";
import AntivirusDropdown from "./AntivirusDropdown";
import AllCategoriesDropdown from "./AllCategoriesDropdown";
import { useNavigate } from "react-router-dom";
import { clearAuth, isAdmin } from "../../utils/auth";
import { useUser, useUserInvalidate, useLogout } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import AdminThemeToggle from "../ThemeToggle/AdminThemeToggle";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
import logo from "../../assets/logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAutodeskDropdownOpen, setIsAutodeskDropdownOpen] = useState(false);
  const [isMicrosoftDropdownOpen, setIsMicrosoftDropdownOpen] = useState(false);
  const [isAdobeDropdownOpen, setIsAdobeDropdownOpen] = useState(false);
  const [isAntivirusDropdownOpen, setIsAntivirusDropdownOpen] = useState(false);
  const [isAllCategoriesDropdownOpen, setIsAllCategoriesDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const { colors } = useAdminTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAuthDropdown = () => setIsAuthDropdownOpen(!isAuthDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const toggleAutodeskDropdown = () => {
    setIsAutodeskDropdownOpen(!isAutodeskDropdownOpen);
  };
  const toggleMicrosoftDropdown = () => {
    setIsMicrosoftDropdownOpen(!isMicrosoftDropdownOpen);
  };
  const toggleAdobeDropdown = () => {
    setIsAdobeDropdownOpen(!isAdobeDropdownOpen);
  };
  const toggleAntivirusDropdown = () => {
    setIsAntivirusDropdownOpen(!isAntivirusDropdownOpen);
  };
  const toggleAllCategoriesDropdown = () => {
    setIsAllCategoriesDropdownOpen(!isAllCategoriesDropdownOpen);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNavigation = (href: string) => {
    if (href === "/admin-login") {
      setShowAdminDashboard(true);
    } else if (href === "/") {
      setShowAdminDashboard(false);
      navigate("/");
    } else if (href === "/logout") {
      handleLogout();
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
    setIsAuthDropdownOpen(false);
    setIsUserDropdownOpen(false);
    setIsAutodeskDropdownOpen(false);
    setIsMicrosoftDropdownOpen(false);
    setIsAdobeDropdownOpen(false);
    setIsAntivirusDropdownOpen(false);
    setIsAllCategoriesDropdownOpen(false);
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
                    src={logo}
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
        <div className="flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 lg:px-8">
          {/* Logo flush left */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => handleNavigation(headerConfig.logo.href)}
              className="flex items-center"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-8 sm:h-10 md:h-12 max-h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Center section - Desktop */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-8">
            {/* Desktop Navigation */}
            <DesktopNavigation
              onNavigate={handleNavigation}
              allCategoriesButtonRef={allCategoriesButtonRef}
              onAllCategoriesClick={toggleAllCategoriesDropdown}
              autodeskButtonRef={autodeskButtonRef}
              onAutodeskClick={toggleAutodeskDropdown}
              microsoftButtonRef={microsoftButtonRef}
              onMicrosoftClick={toggleMicrosoftDropdown}
              adobeButtonRef={adobeButtonRef}
              onAdobeClick={toggleAdobeDropdown}
              antivirusButtonRef={antivirusButtonRef}
              onAntivirusClick={toggleAntivirusDropdown}
            />

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg ml-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={headerConfig.search.placeholder}
                  className="w-full pl-3 pr-10 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 transition-colors duration-200"
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
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md hover:opacity-80 transition-all duration-200"
                  style={{
                    backgroundColor: colors.interactive.primary,
                    color: colors.text.inverse,
                  }}
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Admin Theme Toggle - Shows when user is admin */}
            {isAdmin() && <AdminThemeToggle />}

            {/* User dropdown or Auth dropdown */}
            {user ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 hover:opacity-80 transition-all duration-200 px-1 lg:px-2"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.interactive.primary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.text.secondary;
                  }}
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base whitespace-nowrap">
                    {user.fullName || user.email}
                  </span>
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border py-2 z-50 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {isAdmin(user) && (
                      <button
                        onClick={() => handleNavigation("/admin-dashboard")}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:opacity-80 transition-all duration-200"
                        style={{ color: colors.text.secondary }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLElement
                          ).style.backgroundColor = colors.background.secondary;
                          (e.currentTarget as HTMLElement).style.color =
                            colors.interactive.primary;
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLElement
                          ).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color =
                            colors.text.secondary;
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:opacity-80 transition-all duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          colors.background.secondary;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          colors.text.secondary;
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/my-orders")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:opacity-80 transition-all duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          colors.background.secondary;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          colors.text.secondary;
                      }}
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => handleNavigation("/logout")}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm hover:opacity-80 transition-all duration-200"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          colors.background.secondary;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.status.error;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          colors.text.secondary;
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:block relative">
                <button
                  onClick={toggleAuthDropdown}
                  className="flex items-center space-x-1 lg:space-x-2 hover:opacity-80 transition-all duration-200 px-1 lg:px-2"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.interactive.primary;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      colors.text.secondary;
                  }}
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="text-sm lg:text-base whitespace-nowrap">
                    Sign In
                  </span>
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <AuthDropdown
                  isOpen={isAuthDropdownOpen}
                  onClose={() => setIsAuthDropdownOpen(false)}
                  onNavigate={handleNavigation}
                />
              </div>
            )}

            {/* Currency Selector */}
            <CurrencyDropdown className="hidden sm:block" compact />

            {/* Cart */}
            <button
              onClick={() => handleNavigation("/cart")}
              className="relative flex items-center space-x-1 lg:space-x-2 hover:opacity-80 transition-all duration-200 px-1 lg:px-2"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.interactive.primary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.text.secondary;
              }}
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline text-sm lg:text-base whitespace-nowrap">
                My Cart
              </span>
              {getItemCount() > 0 && (
                <span
                  className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 text-xs rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center"
                  style={{
                    backgroundColor: colors.interactive.primary,
                    color: colors.text.inverse,
                  }}
                >
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-md hover:opacity-80 transition-colors duration-200 ml-2"
              style={{ color: colors.text.secondary }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        searchQuery={searchQuery}
        onClose={() => setIsMenuOpen(false)}
        onSearch={handleSearch}
        onSearchChange={setSearchQuery}
        onSearchKeyPress={handleKeyPress}
        onNavigate={handleNavigation}
        user={user}
        onLogout={handleLogout}
      />

      {/* Overlay to close dropdowns */}
      {(isAuthDropdownOpen ||
        isUserDropdownOpen ||
        isAutodeskDropdownOpen ||
        isMicrosoftDropdownOpen ||
        isAdobeDropdownOpen ||
        isAntivirusDropdownOpen ||
        isAllCategoriesDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsAuthDropdownOpen(false);
            setIsUserDropdownOpen(false);
            setIsAutodeskDropdownOpen(false);
            setIsMicrosoftDropdownOpen(false);
            setIsAdobeDropdownOpen(false);
            setIsAntivirusDropdownOpen(false);
            setIsAllCategoriesDropdownOpen(false);
          }}
        />
      )}

      {/* All Categories Dropdown */}
      {isAllCategoriesDropdownOpen && (
        <AllCategoriesDropdown
          isOpen={isAllCategoriesDropdownOpen}
          onClose={() => setIsAllCategoriesDropdownOpen(false)}
          buttonRef={allCategoriesButtonRef}
        />
      )}

      {/* Autodesk Dropdown */}
      {isAutodeskDropdownOpen && (
        <AutodeskDropdown
          isOpen={isAutodeskDropdownOpen}
          onClose={() => setIsAutodeskDropdownOpen(false)}
          onNavigate={handleNavigation}
          buttonRef={autodeskButtonRef}
        />
      )}

      {/* Microsoft Dropdown */}
      {isMicrosoftDropdownOpen && (
        <MicrosoftDropdown
          isOpen={isMicrosoftDropdownOpen}
          onClose={() => setIsMicrosoftDropdownOpen(false)}
          onNavigate={handleNavigation}
          buttonRef={microsoftButtonRef}
        />
      )}

      {/* Adobe Dropdown */}
      {isAdobeDropdownOpen && (
        <AdobeDropdown
          isOpen={isAdobeDropdownOpen}
          onClose={() => setIsAdobeDropdownOpen(false)}
          onNavigate={handleNavigation}
          buttonRef={adobeButtonRef}
        />
      )}

      {/* Antivirus Dropdown */}
      {isAntivirusDropdownOpen && (
        <AntivirusDropdown
          isOpen={isAntivirusDropdownOpen}
          onClose={() => setIsAntivirusDropdownOpen(false)}
          onNavigate={handleNavigation}
          buttonRef={antivirusButtonRef}
        />
      )}
    </header>
  );
};

export default Header;
