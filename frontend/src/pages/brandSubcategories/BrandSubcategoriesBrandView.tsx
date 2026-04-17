import { ChevronRight } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import type { BrandData } from "./brandSubcategoriesTypes";
import { groupSubcategoriesBySectionName } from "./groupBrandSubcategories";

type BrandSubcategoriesBrandViewProps = {
  brandInfo: BrandData;
  colors: ThemeColors;
  navigate: NavigateFunction;
};

export function BrandSubcategoriesBrandView({
  brandInfo,
  colors,
  navigate,
}: BrandSubcategoriesBrandViewProps) {
  const groupedCategories = groupSubcategoriesBySectionName(
    brandInfo.subcategories,
  );

  const handleCategoryClick = (category: string) => {
    navigate(`/category?brand=${brandInfo.name}&category=${category}`);
  };

  const handleViewAllClick = () => {
    navigate(`/category?brand=${brandInfo.name}`);
  };

  return (
    <div
      className="min-h-screen pt-20 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div
          className="flex items-center text-sm mb-4 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hover:opacity-70 transition-opacity"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span style={{ color: colors.text.primary }}>
            {brandInfo.displayName}
          </span>
        </div>

        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {brandInfo.displayName} Products
          </h1>
          <p
            className="text-base md:text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {brandInfo.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(groupedCategories).map(([categoryName, items]) => (
            <div
              key={categoryName}
              className="border rounded-xl p-5 transition-all duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 pb-2 border-b uppercase tracking-wide"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {categoryName}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.category}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(item.category)}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.background.secondary;
                        e.currentTarget.style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      <span className="text-sm font-medium">
                        {item.displayName}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleViewAllClick}
            className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            View All {brandInfo.displayName} Products
          </button>
        </div>
      </div>
    </div>
  );
}
