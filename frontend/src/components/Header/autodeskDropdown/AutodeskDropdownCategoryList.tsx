import { ChevronRight } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { AutodeskCategory } from "./autodeskDropdownData";

type AutodeskDropdownCategoryListProps = {
  categories: AutodeskCategory[];
  hoveredCategory: string | null;
  colors: ThemeColors;
  onHoverCategory: (name: string) => void;
  onCategoryClick: (categoryName: string) => void;
};

export function AutodeskDropdownCategoryList({
  categories,
  hoveredCategory,
  colors,
  onHoverCategory,
  onCategoryClick,
}: AutodeskDropdownCategoryListProps) {
  return (
    <div
      className="w-80 border-r"
      style={{
        borderColor: colors.border.primary,
        backgroundColor: colors.background.secondary,
      }}
    >
      <div className="py-2">
        {categories.map((category, index) => (
          <button
            key={index}
            type="button"
            onMouseEnter={() => onHoverCategory(category.name)}
            onClick={() => onCategoryClick(category.name)}
            className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4"
            style={{
              backgroundColor:
                hoveredCategory === category.name
                  ? colors.background.accent
                  : "transparent",
              borderLeftColor:
                hoveredCategory === category.name
                  ? colors.interactive.primary
                  : "transparent",
            }}
          >
            <div>
              <div
                className="font-semibold text-base mb-0.5"
                style={{
                  color:
                    hoveredCategory === category.name
                      ? colors.interactive.primary
                      : colors.text.primary,
                }}
              >
                {category.name}
              </div>
              <div
                className="text-xs"
                style={{ color: colors.text.secondary }}
              >
                {category.products.length} products
              </div>
            </div>
            <ChevronRight
              className="w-5 h-5 transition-all"
              style={{
                color:
                  hoveredCategory === category.name
                    ? colors.interactive.primary
                    : colors.text.secondary,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
