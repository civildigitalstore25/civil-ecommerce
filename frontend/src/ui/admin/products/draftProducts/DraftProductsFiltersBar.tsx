import { Search, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  showBestSellers: boolean;
  onClearFilters: () => void;
};

export function DraftProductsFiltersBar({
  colors,
  searchTerm,
  onSearchChange,
  showBestSellers,
  onClearFilters,
}: Props) {
  const hasFilters = searchTerm || showBestSellers;

  return (
    <div
      className="rounded-xl p-6 shadow-lg border transition-colors duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            style={{ color: colors.text.secondary }}
          />
          <input
            type="text"
            placeholder="Search draft products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: colors.border.primary,
              color: colors.text.secondary,
              backgroundColor: colors.background.secondary,
            }}
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${colors.status.info}20`,
                color: colors.status.info,
              }}
            >
              Search: {searchTerm}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
