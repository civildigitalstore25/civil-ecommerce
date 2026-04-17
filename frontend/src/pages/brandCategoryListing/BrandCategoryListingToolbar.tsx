import React from "react";
import { ChevronDown } from "lucide-react";
import {
  brandLabels,
  categoryLabels,
  sortOptions,
  type SortOption,
} from "./brandCategoryListingConstants";
import { getListingDisplayTitle } from "./getListingDisplayTitle";

type Props = {
  brand: string;
  category: string;
  searchTerm: string;
  colors: any;
  productsLength: number;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  sortDropdownOpen: boolean;
  setSortDropdownOpen: (v: boolean) => void;
  navigate: (to: string) => void;
};

export const BrandCategoryListingToolbar: React.FC<Props> = ({
  brand,
  category,
  searchTerm,
  colors,
  productsLength,
  sortBy,
  setSortBy,
  sortDropdownOpen,
  setSortDropdownOpen,
  navigate,
}) => {
  const displayTitle = getListingDisplayTitle(brand, category, searchTerm);

  return (
    <>
      <div
        className="flex items-center text-sm mb-4 transition-colors duration-200"
        style={{ color: colors.text.secondary }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="hover:text-blue-600 transition-colors"
        >
          Home
        </button>
        {brand && (
          <>
            <span className="mx-2">/</span>
            <button
              type="button"
              onClick={() => navigate(`/category?brand=${brand}`)}
              className="hover:text-blue-600 transition-colors"
            >
              {brandLabels[brand] || brand}
            </button>
          </>
        )}
        {category && (
          <>
            <span className="mx-2">/</span>
            <span style={{ color: colors.text.primary }}>
              {categoryLabels[category] || category}
            </span>
          </>
        )}
        {searchTerm && (
          <>
            <span className="mx-2">/</span>
            <span style={{ color: colors.text.primary }}>
              Search: {searchTerm}
            </span>
          </>
        )}
      </div>

      <div className="mb-6">
        <h1
          className="text-4xl font-bold mb-2 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          {displayTitle}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p
            className="text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {productsLength} product{productsLength !== 1 && "s"} found
          </p>
          {productsLength > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-200"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                  color: colors.text.primary,
                }}
              >
                Sort:{" "}
                {sortOptions.find((o) => o.value === sortBy)?.label || "Name (Z-A)"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute right-0 mt-1 py-1 rounded-lg border shadow-lg z-20 min-w-[180px]"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                    }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors duration-200 ${
                          sortBy === option.value ? "font-semibold" : ""
                        }`}
                        style={{
                          color:
                            sortBy === option.value
                              ? colors.interactive.primary
                              : colors.text.primary,
                          backgroundColor:
                            sortBy === option.value
                              ? `${colors.interactive.primary}15`
                              : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (sortBy !== option.value) {
                            e.currentTarget.style.backgroundColor =
                              colors.background.secondary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortBy !== option.value) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
