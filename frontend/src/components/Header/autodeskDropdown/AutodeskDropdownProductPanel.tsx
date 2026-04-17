import { ChevronRight } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AutodeskCategory } from "./autodeskDropdownData";

type AutodeskDropdownProductPanelProps = {
  categories: AutodeskCategory[];
  hoveredCategory: string | null;
  colors: ThemeColors;
  onProductClick: (href: string) => void;
};

export function AutodeskDropdownProductPanel({
  categories,
  hoveredCategory,
  colors,
  onProductClick,
}: AutodeskDropdownProductPanelProps) {
  return (
    <div
      className="flex-1 p-6 overflow-y-auto"
      style={{ backgroundColor: colors.background.primary }}
    >
      {hoveredCategory ? (
        <>
          <h3
            className="text-lg font-bold mb-4 pb-2 border-b uppercase tracking-wide"
            style={{
              color: colors.interactive.primary,
              borderColor: colors.border.primary,
            }}
          >
            {hoveredCategory}
          </h3>
          <ul className="space-y-2">
            {categories
              .find((c) => c.name === hoveredCategory)
              ?.products.map((product, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onProductClick(product.href)}
                    className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        colors.background.accent;
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
                    <span className="font-medium">{product.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <div
          className="flex items-center justify-center h-full"
          style={{ color: colors.text.secondary }}
        >
          <p className="text-center">
            Select a category to view its products
          </p>
        </div>
      )}
    </div>
  );
}
