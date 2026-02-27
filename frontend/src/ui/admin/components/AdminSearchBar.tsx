import React from "react";
import { Search } from "lucide-react";
import { useAdminTheme } from "../../../contexts/AdminThemeContext";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "w-full sm:w-64",
}) => {
  const { colors } = useAdminTheme();

  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
        style={{ color: colors.text.secondary }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 ${inputClassName}`}
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      />
    </div>
  );
};

export default AdminSearchBar;
