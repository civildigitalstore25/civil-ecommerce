import React from "react";
import { Search } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  searchTerm: string;
  onSearchChange: (search: string) => void;
};

const ExpirySearchPanel: React.FC<Props> = ({
  colors,
  searchTerm,
  onSearchChange,
}) => (
  <div
    className="rounded-xl shadow-sm border p-6 transition-colors duration-200"
    style={{
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.primary,
    }}
  >
    <div className="flex items-center gap-3">
      <Search
        className="w-5 h-5"
        style={{ color: colors.text.secondary }}
      />
      <input
        type="text"
        placeholder="Search by customer name, email, product name, or order ID..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg border transition-colors duration-200 focus:outline-none"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      />
    </div>
  </div>
);

export default ExpirySearchPanel;
