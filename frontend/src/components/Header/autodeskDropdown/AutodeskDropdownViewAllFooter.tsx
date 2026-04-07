import { ChevronRight } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type AutodeskDropdownViewAllFooterProps = {
  colors: ThemeColors;
  onViewAll: () => void;
};

export function AutodeskDropdownViewAllFooter({
  colors,
  onViewAll,
}: AutodeskDropdownViewAllFooterProps) {
  return (
    <div
      className="px-6 py-4 border-t"
      style={{
        borderColor: colors.border.primary,
        backgroundColor: colors.background.primary,
      }}
    >
      <button
        type="button"
        onClick={onViewAll}
        className="text-sm font-semibold transition-colors inline-flex items-center"
        style={{ color: colors.interactive.primary }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color =
            colors.interactive.primary;
        }}
      >
        View All Autodesk Products
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
