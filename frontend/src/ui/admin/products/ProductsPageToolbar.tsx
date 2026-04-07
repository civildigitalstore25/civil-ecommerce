import React from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedCompany: string;
  setSelectedCompany: (v: string) => void;
  selectedStatus: string;
  setSelectedStatus: (v: string) => void;
  showBestSellers: boolean;
  setShowBestSellers: (v: boolean) => void;
  categories: string[];
  companies: string[];
  clearFilters: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onAddProduct: () => void;
};

const ProductsPageToolbar: React.FC<Props> = ({
  colors,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedCompany,
  setSelectedCompany,
  selectedStatus,
  setSelectedStatus,
  showBestSellers,
  setShowBestSellers,
  categories,
  companies,
  clearFilters,
  selectedCount,
  onBulkDelete,
  onAddProduct,
}) => {
  const filtersActive =
    searchTerm ||
    selectedCategory !== "All Categories" ||
    selectedCompany !== "All Brands" ||
    selectedStatus !== "All Status" ||
    showBestSellers;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: colors.text.secondary }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 w-full sm:w-64 transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-48 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option>All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-48 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option>All Brands</option>
          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:ring-2 w-full sm:w-40 transition-colors duration-200"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        >
          <option>All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showBestSellers}
            onChange={(e) => setShowBestSellers(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-yellow-500 focus:ring-yellow-500"
          />
          <span style={{ color: colors.text.secondary }}>Best Sellers Only</span>
        </label>

        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center space-x-1 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <X className="w-4 h-4" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {selectedCount > 0 && (
          <button
            type="button"
            className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200 bg-red-600 text-white hover:bg-red-700"
            onClick={onBulkDelete}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedCount})</span>
          </button>
        )}
        <div
          className="flex items-center border rounded-lg"
          style={{ borderColor: colors.border.primary }}
        />
        <button
          type="button"
          className="px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors duration-200"
          style={{
            background: "#0068ff",
            color: "#fff",
            border: "none",
          }}
          onClick={onAddProduct}
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
};

export default ProductsPageToolbar;
