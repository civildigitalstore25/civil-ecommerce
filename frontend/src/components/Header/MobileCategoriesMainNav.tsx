import { ChevronRight, Home, Mail } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import { headerConfig } from "./HeaderConfig";

type MobileCategoriesMainNavProps = {
  navigate: NavigateFunction;
  colors: ThemeColors;
};

export function MobileCategoriesMainNav({
  navigate,
  colors,
}: MobileCategoriesMainNavProps) {
  return (
    <>
      <div
        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: colors.text.secondary }}
      >
        All Categories
      </div>

      {headerConfig.navigation.map((item) => (
        <button
          key={item.href}
          type="button"
          onClick={() => navigate(item.href)}
          className="w-full flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200 text-left"
          style={{ color: colors.text.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          <span className="font-medium text-sm flex items-center space-x-2">
            {item.label === "Home" && <Home className="w-4 h-4" />}
            {item.label === "Contact" && <Mail className="w-4 h-4" />}
            <span>{item.label}</span>
          </span>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: colors.text.secondary }}
          />
        </button>
      ))}
    </>
  );
}
