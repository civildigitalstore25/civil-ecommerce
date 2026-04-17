import React from "react";
import AdminDashboard from "../../ui/admin/AdminDashboard";
import { headerDarkLogo, headerLightLogo } from "./headerLogos";
import type { ThemeMode } from "../../contexts/AdminThemeContext";

interface HeaderAdminDashboardChromeProps {
  theme: ThemeMode;
  onLogoNavigate: () => void;
  onExitAdmin: () => void;
}

export const HeaderAdminDashboardChrome: React.FC<
  HeaderAdminDashboardChromeProps
> = ({ theme, onLogoNavigate, onExitAdmin }) => {
  return (
    <div>
      <header className="bg-white shadow-sm border-b border-gray-200 w-full">
        <div className="w-full">
          <div className="flex items-center justify-between py-2 sm:py-4 px-2 sm:px-4 lg:px-8">
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={onLogoNavigate}
                className="flex items-center"
                type="button"
              >
                <img
                  src={theme === "dark" ? headerDarkLogo : headerLightLogo}
                  alt="Logo"
                  className="h-10 w-[140px] sm:h-10 sm:w-[140px] md:h-12 md:w-[165px] object-contain object-left"
                />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Admin Panel Active</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={onExitAdmin}
                type="button"
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
};
