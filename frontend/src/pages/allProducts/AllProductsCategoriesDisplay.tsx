import { ChevronRight, Package } from "lucide-react";
import { brandCategories } from "../../constants/brandCategories";

interface AllProductsCategoriesDisplayProps {
  colors: any;
  expandedBrand: string | null;
  onCategoryClick: (brand: string, category: string) => void;
  onBrandClick: (brand: string) => void;
}

export function AllProductsCategoriesDisplay({
  colors,
  expandedBrand,
  onCategoryClick,
  onBrandClick,
}: AllProductsCategoriesDisplayProps) {
  if (!expandedBrand) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="text-6xl mb-4">👈</div>
        <p className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
          Select a brand to see products
        </p>
        <p className="text-sm" style={{ color: colors.text.secondary }}>
          Choose from 10 professional software brands
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-6"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="mb-6 pb-4 border-b" style={{ borderColor: colors.border.primary }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
          {brandCategories[expandedBrand].label}
        </h2>
        <button
          onClick={() => onBrandClick(expandedBrand)}
          className="text-sm font-medium transition-colors duration-200 inline-flex items-center"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          View All {brandCategories[expandedBrand].label} Products
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {brandCategories[expandedBrand].categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {brandCategories[expandedBrand].categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryClick(expandedBrand, category.value)}
              className="px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group rounded-lg hover:scale-[1.02]"
              style={{ backgroundColor: colors.background.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.secondary;
              }}
            >
              <span className="font-medium text-sm" style={{ color: colors.text.primary }}>
                {category.label}
              </span>
              <ChevronRight
                className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: colors.interactive.primary }}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
          <p style={{ color: colors.text.secondary }}>No categories available</p>
        </div>
      )}
    </div>
  );
}
