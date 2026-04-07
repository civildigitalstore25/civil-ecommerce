import { ChevronDown, ChevronRight } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import { brandCategories } from "../../constants/brandCategories";

type MobileCategoriesBrandAccordionProps = {
  expandedBrand: string | null;
  onToggleBrand: (brandKey: string) => void;
  navigate: NavigateFunction;
  colors: ThemeColors;
};

export function MobileCategoriesBrandAccordion({
  expandedBrand,
  onToggleBrand,
  navigate,
  colors,
}: MobileCategoriesBrandAccordionProps) {
  const handleCategoryClick = (brand: string, category: string) => {
    navigate(`/category?brand=${brand}&category=${category}`);
  };

  const handleBrandOnlyClick = (brand: string) => {
    navigate(`/category?brand=${brand}`);
  };

  return (
    <>
      <div
        className="my-2 border-t"
        style={{ borderColor: colors.border.primary }}
      />

      {Object.entries(brandCategories).map(([brandKey, brandData]) => (
        <div key={brandKey}>
          <button
            type="button"
            onClick={() => {
              if (brandData.categories.length > 0) {
                onToggleBrand(brandKey);
              } else {
                handleBrandOnlyClick(brandKey);
              }
            }}
            className="w-full flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200"
            style={{
              backgroundColor:
                expandedBrand === brandKey
                  ? colors.background.secondary
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (expandedBrand !== brandKey) {
                e.currentTarget.style.backgroundColor =
                  colors.background.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (expandedBrand !== brandKey) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <span
                className="font-medium text-sm"
                style={{
                  color:
                    expandedBrand === brandKey
                      ? colors.interactive.primary
                      : colors.text.primary,
                }}
              >
                {brandData.label}
              </span>
              {brandData.categories.length > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary,
                  }}
                >
                  {brandData.categories.length}
                </span>
              )}
            </div>
            {brandData.categories.length > 0 ? (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedBrand === brandKey ? "rotate-180" : ""
                }`}
                style={{
                  color:
                    expandedBrand === brandKey
                      ? colors.interactive.primary
                      : colors.text.secondary,
                }}
              />
            ) : (
              <ChevronRight
                className="w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
            )}
          </button>

          {expandedBrand === brandKey && brandData.categories.length > 0 && (
            <div
              className="ml-4 mt-1 space-y-1 border-l-2 pl-3"
              style={{ borderColor: colors.border.primary }}
            >
              {brandData.categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(brandKey, category.value)
                  }
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-left"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                    e.currentTarget.style.color = colors.interactive.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  <span className="text-sm">{category.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
