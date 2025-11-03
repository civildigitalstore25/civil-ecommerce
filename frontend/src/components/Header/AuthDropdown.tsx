import React from "react";
import { UserCheck, Shield } from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface AuthDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const AuthDropdown: React.FC<AuthDropdownProps> = ({ isOpen, onNavigate }) => {
  const { colors } = useAdminTheme();

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg border py-2 z-50 transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <button
        onClick={() => onNavigate(headerConfig.auth.customer.href)}
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
          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
        }}
      >
        <UserCheck className="w-4 h-4" />
        <span>{headerConfig.auth.customer.label}</span>
      </button>
      <button
        onClick={() => onNavigate(headerConfig.auth.admin.href)}
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
          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
        }}
      >
        <Shield className="w-4 h-4" />
        <span>{headerConfig.auth.admin.label}</span>
      </button>
    </div>
  );
};

export default AuthDropdown;
