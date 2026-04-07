import { ChevronRight } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { brandCategories } from "../../../constants/brandCategories";

interface AllCategoriesDropdownBodyProps {
  colors: ThemeColors;
  hoveredBrand: string | null;
  onHoverBrand: (brandKey: string) => void;
  onBrandClick: (brand: string) => void;
  onCategoryClick: (brand: string, category: string) => void;
}

export function AllCategoriesDropdownBody({
  colors,
  hoveredBrand,
  onHoverBrand,
  onBrandClick,
  onCategoryClick,
}: AllCategoriesDropdownBodyProps) {
  return (
    <div className="flex" style={{ minHeight: "400px", maxHeight: "70vh" }}>
      <div
        className="w-80 border-r flex flex-col min-h-0 shrink-0"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.secondary,
        }}
      >
        <div className="py-2 flex-1 min-h-0 overflow-y-auto all-categories-dropdown">
          {Object.entries(brandCategories).map(([brandKey, brandData]) => (
            <button
              key={brandKey}
              type="button"
              onMouseEnter={() => onHoverBrand(brandKey)}
              onClick={() => onBrandClick(brandKey)}
              className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group brand-item border-l-4"
              style={{
                backgroundColor:
                  hoveredBrand === brandKey
                    ? colors.background.accent
                    : "transparent",
                borderLeftColor:
                  hoveredBrand === brandKey
                    ? colors.interactive.primary
                    : "transparent",
              }}
            >
              <div>
                <div
                  className="font-semibold text-base mb-0.5"
                  style={{
                    color:
                      hoveredBrand === brandKey
                        ? colors.interactive.primary
                        : colors.text.primary,
                  }}
                >
                  {brandData.label}
                </div>
                <div className="text-xs" style={{ color: colors.text.secondary }}>
                  {brandData.categories.length}{" "}
                  {brandData.categories.length === 1 ? "product" : "products"}
                </div>
              </div>
              {brandData.categories.length > 0 && (
                <ChevronRight
                  className="w-5 h-5 transition-all"
                  style={{
                    color:
                      hoveredBrand === brandKey
                        ? colors.interactive.primary
                        : colors.text.secondary,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="flex-1"
        style={{ backgroundColor: colors.background.primary }}
      >
        {hoveredBrand &&
        brandCategories[hoveredBrand] &&
        brandCategories[hoveredBrand].categories.length > 0 ? (
          <div
            className="p-6 category-dropdown-section"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <div className="mb-4">
              <h4
                className="text-lg font-bold uppercase tracking-wider mb-1"
                style={{ color: colors.interactive.primary }}
              >
                {brandCategories[hoveredBrand].label} Products
              </h4>
              <div
                className="h-1 w-16 rounded"
                style={{ backgroundColor: colors.interactive.primary }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {brandCategories[hoveredBrand].categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => onCategoryClick(hoveredBrand, category.value)}
                  className="px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group category-item rounded-lg"
                  style={{ backgroundColor: colors.background.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                  }}
                >
                  <span
                    className="font-medium transition-colors"
                    style={{ color: colors.text.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.interactive.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.text.primary;
                    }}
                  >
                    {category.label}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.interactive.primary;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : hoveredBrand ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg" style={{ color: colors.text.secondary }}>
                No categories available for{" "}
                {brandCategories[hoveredBrand]?.label}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <span style={{ color: colors.text.secondary, fontSize: 14 }}>
              Select a brand to view its products
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
