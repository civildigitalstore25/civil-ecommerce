import { ChevronRight } from "lucide-react";
import { brandCategories } from "../../constants/brandCategories";

interface AllProductsBrandListProps {
  colors: any;
  expandedBrand: string | null;
  onToggleBrand: (brand: string) => void;
}

export function AllProductsBrandList({
  colors,
  expandedBrand,
  onToggleBrand,
}: AllProductsBrandListProps) {
  return (
    <div
      className="w-80 rounded-xl border overflow-hidden sticky top-24"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
        maxHeight: "calc(100vh - 120px)",
      }}
    >
      <div
        className="px-6 py-4 border-b"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.secondary,
        }}
      >
        <h3 className="text-lg font-bold" style={{ color: colors.text.primary }}>
          Browse by Brand
        </h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {Object.entries(brandCategories).map(([brandKey, brandData]) => (
          <button
            key={brandKey}
            onClick={() => onToggleBrand(brandKey)}
            className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4 hover:scale-[1.01]"
            style={{
              backgroundColor:
                expandedBrand === brandKey
                  ? colors.background.accent
                  : "transparent",
              borderLeftColor:
                expandedBrand === brandKey
                  ? colors.interactive.primary
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
            <div>
              <div
                className="font-semibold text-base mb-0.5"
                style={{
                  color:
                    expandedBrand === brandKey
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
            <ChevronRight
              className="w-5 h-5 transition-all"
              style={{
                color:
                  expandedBrand === brandKey
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
