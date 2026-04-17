import React from "react";
import {
  User,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import DesktopNavigation from "./DesktopNavigation";
import AuthDropdown from "./AuthDropdown";
import MobileMenu from "./MobileMenu";
import { HeaderAdminDashboardChrome } from "./HeaderAdminDashboardChrome";
import { HeaderDesktopUserMenu } from "./HeaderDesktopUserMenu";
import { useHeaderController } from "./useHeaderController";
import AdminThemeToggle from "../ThemeToggle/AdminThemeToggle";
import CurrencyDropdown from "../CurrencyDropdown/CurrencyDropdown";
import { headerDarkLogo, headerLightLogo } from "./headerLogos";

const Header: React.FC = () => {
  const {
    refs,
    isMenuOpen,
    toggleMenu,
    setIsMenuOpen,
    openDropdown,
    handleDropdownOpen,
    handleDropdownClose,
    showAdminDashboard,
    setShowAdminDashboard,
    handleNavigation,
    handleLogout,
    user,
    getItemCount,
    colors,
    theme,
    isAdminUser,
  } = useHeaderController();

  if (showAdminDashboard) {
    return (
      <HeaderAdminDashboardChrome
        theme={theme}
        onLogoNavigate={() => handleNavigation(headerConfig.logo.href)}
        onExitAdmin={() => setShowAdminDashboard(false)}
      />
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
      <div className="w-full">
        <div className="flex items-center justify-between py-3 sm:py-4 px-3 sm:px-4 lg:px-8">
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="flex items-center"
            >
              <img
                src={theme === "dark" ? headerDarkLogo : headerLightLogo}
                alt="Logo"
                className="h-10 w-[140px] sm:h-10 sm:w-[140px] md:h-12 md:w-[165px] object-contain object-left"
              />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 lg:px-4 gap-2">
            <DesktopNavigation
              onNavigate={handleNavigation}
              allCategoriesButtonRef={refs.allCategoriesButtonRef}
              autodeskButtonRef={refs.autodeskButtonRef}
              microsoftButtonRef={refs.microsoftButtonRef}
              adobeButtonRef={refs.adobeButtonRef}
              antivirusButtonRef={refs.antivirusButtonRef}
              hideHomeMenu
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 pr-2 lg:pr-3 min-h-[56px]">
            <button
              type="button"
              onClick={() => handleNavigation("/cart")}
              className="relative flex items-center hover:opacity-80 px-1 lg:px-2"
              style={{ color: colors.text.secondary }}
            >
              <ShoppingCart className="w-5 h-5 lg:w-5 lg:h-5" />
              {getItemCount() > 0 && (
                <span
                  className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 text-xs rounded-full w-5 h-5 lg:w-5 lg:h-5 flex items-center justify-center border"
                  style={{
                    background: colors.interactive.primary,
                    color: colors.text.inverse,
                    borderColor: colors.background.primary,
                  }}
                >
                  {getItemCount()}
                </span>
              )}
            </button>

            {user ? (
              <HeaderDesktopUserMenu
                colors={colors}
                isAdminUser={isAdminUser}
                onNavigate={handleNavigation}
              />
            ) : (
              <div
                className="hidden sm:block relative auth-dropdown-group"
                onMouseEnter={() => handleDropdownOpen("auth")}
                onMouseLeave={handleDropdownClose}
              >
                <button
                  type="button"
                  className="flex items-center hover:opacity-80 px-1 lg:px-2"
                  style={{ color: colors.text.secondary }}
                >
                  <User className="w-5 h-5 lg:w-5 lg:h-5" />
                </button>
                <AuthDropdown
                  isOpen={openDropdown === "auth"}
                  onClose={handleDropdownClose}
                  onNavigate={handleNavigation}
                />
              </div>
            )}

            <CurrencyDropdown className="hidden sm:block" compact />

            <span
              className="flex items-center"
              style={{ fontSize: 18, padding: "0 2px" }}
            >
              <AdminThemeToggle iconSize={18} />
            </span>

            <button
              type="button"
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

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigation}
          user={user}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
