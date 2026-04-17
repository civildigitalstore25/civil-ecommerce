import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

type BrandOption = { value: string; label: string };

export type AddProductModalBrandCategorySectionProps = {
  colors: ThemeColors;
  brands: BrandOption[];
  brandCategories: Record<string, BrandOption[]>;
  brand: string;
  category: string;
  status: string;
  isBestSeller: boolean;
  isOutOfStock: boolean;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onBestSellerChange: (checked: boolean) => void;
  onOutOfStockChange: (checked: boolean) => void;
};

export function AddProductModalBrandCategorySection({
  colors,
  brands,
  brandCategories,
  brand,
  category,
  status,
  isBestSeller,
  isOutOfStock,
  onBrandChange,
  onCategoryChange,
  onStatusChange,
  onBestSellerChange,
  onOutOfStockChange,
}: AddProductModalBrandCategorySectionProps) {
  return (
    <div className="space-y-6">
      <h2
        className="text-xl font-semibold border-b pb-2 transition-colors duration-200"
        style={{
          color: colors.text.primary,
          borderBottomColor: colors.border.primary,
        }}
      >
        Brand & Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.primary;
            }}
            required
          >
            {brands.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.interactive.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border.primary;
            }}
            required
            disabled={brandCategories[brand]?.length === 0}
          >
            {brandCategories[brand]?.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              brandCategories[brand]?.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Best Seller
          </label>
          <label className="flex items-center space-x-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={isBestSeller || false}
              onChange={(e) => onBestSellerChange(e.target.checked)}
              className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ accentColor: colors.interactive.primary }}
            />
            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
              Mark as Best Seller
            </span>
          </label>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
            Out of Stock
          </label>
          <label className="flex items-center space-x-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={isOutOfStock || false}
              onChange={(e) => onOutOfStockChange(e.target.checked)}
              className="w-5 h-5 rounded focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
              style={{ accentColor: colors.interactive.primary }}
            />
            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
              Mark as Out of Stock
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
