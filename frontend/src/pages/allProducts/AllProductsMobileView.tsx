import { ChevronRight } from "lucide-react";
import { brandCategories } from "../../constants/brandCategories";

interface AllProductsMobileViewProps {
  colors: any;
  expandedBrand: string | null;
  onToggleBrand: (brand: string) => void;
  onCategoryClick: (brand: string, category: string) => void;
  onBrandClick: (brand: string) => void;
}

export function AllProductsMobileView({
  colors,
  expandedBrand,
  onToggleBrand,
  onCategoryClick,
  onBrandClick,
}: AllProductsMobileViewProps) {
  return (
    <div className="md:hidden space-y-3">
      {Object.entries(brandCategories).map(([brandKey, brandData]) => (
        <div
          key={brandKey}
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          <button
            onClick={() => onToggleBrand(brandKey)}
            className="w-full px-4 py-4 flex items-center justify-between transition-colors duration-200"
            style={{
              backgroundColor:
                expandedBrand === brandKey
                  ? colors.background.accent
                  : colors.background.secondary,
            }}
          >
            <div className="text-left">
              <div
                className="font-semibold text-base mb-1"
                style={{ color: colors.text.primary }}
              >
                {brandData.label}
              </div>
              <div className="text-xs" style={{ color: colors.text.secondary }}>
                {brandData.categories.length}{" "}
                {brandData.categories.length === 1 ? "product" : "products"}
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 transition-transform duration-200 ${
                expandedBrand === brandKey ? "rotate-90" : ""
              }`}
              style={{ color: colors.text.secondary }}
            />
          </button>

          {expandedBrand === brandKey && (
            <div className="px-4 pb-4 pt-2 space-y-2">
              <button
                onClick={() => onBrandClick(brandKey)}
                className="w-full px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: colors.interactive.primary,
                  color: colors.text.inverse,
                }}
              >
                View All {brandData.label} Products
              </button>
              {brandData.categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryClick(brandKey, category.value)}
                  className="w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-200 flex items-center justify-between"
                  style={{ backgroundColor: colors.background.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.secondary;
                  }}
                >
                  <span style={{ color: colors.text.primary }}>{category.label}</span>
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: colors.text.secondary }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
