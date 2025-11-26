import React from "react";
import { Sun, Moon } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";


interface AdminThemeToggleProps {
  iconSize?: number;
}

const AdminThemeToggle: React.FC<AdminThemeToggleProps> = ({ iconSize = 20 }) => {
  const { theme, colors, toggleTheme } = useAdminTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: colors.background.secondary,
        // No border for icon button, to match other icons
      }}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon
          className="transition-colors duration-200"
          style={{ color: colors.text.secondary, width: iconSize, height: iconSize }}
        />
      ) : (
        <Sun
          className="transition-colors duration-200"
          style={{ color: colors.interactive.primary, width: iconSize, height: iconSize }}
        />
      )}
    </button>
  );
};

export default AdminThemeToggle;
