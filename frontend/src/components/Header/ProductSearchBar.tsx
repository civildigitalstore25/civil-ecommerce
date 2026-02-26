import React, { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { headerConfig } from "./HeaderConfig";
import { trackSearch } from "../../utils/analytics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface ProductSearchBarProps {
  className?: string;
  onSearch?: () => void;
}

// Debounce hook for live search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  className = "",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useAdminTheme();

  const debouncedQuery = useDebounce(query.trim(), 300);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || "";
    setQuery(searchTerm);
  }, [location.pathname, location.search]);

  // Fetch search results as user types
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { search: debouncedQuery, limit: 8 },
      });
      const products = data.products || [];
      return products.filter((p: any) => p.status === "active" || !p.status);
    },
    enabled: debouncedQuery.length >= 2,
  });

  const results = searchData || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    trackSearch(trimmed);
    navigate(`/category?search=${encodeURIComponent(trimmed)}`);
    setIsDropdownOpen(false);
    onSearch?.();
  };

  const handleResultClick = (product: any) => {
    const versionPart = product.version?.trim() ? `-${product.version.toString().trim().toLowerCase()}` : "";
    const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
    navigate(`/product/${slug}`);
    setIsDropdownOpen(false);
    setQuery("");
    onSearch?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleInputFocus = () => {
    if (results.length > 0 || isLoading) setIsDropdownOpen(true);
  };

  const showDropdown = isDropdownOpen && debouncedQuery.length >= 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <Search
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ color: colors.text.secondary }}
        />
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={headerConfig.search.placeholder}
          autoComplete="off"
          className="w-full h-10 pl-9 pr-3 rounded-lg border text-sm outline-none transition-colors duration-200"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
            color: colors.text.primary,
          }}
        />
      </form>

      {/* Live search results dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 mt-1 w-80 min-w-80 rounded-lg shadow-lg border overflow-hidden z-50 max-h-80 overflow-y-auto"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm" style={{ color: colors.text.secondary }}>
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product: any) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => handleResultClick(product)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-opacity-80 transition-colors"
                  style={{
                    color: colors.text.primary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.interactive.primary}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt=""
                      className="w-10 h-10 object-contain rounded flex-shrink-0"
                      style={{ backgroundColor: colors.background.secondary }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {product.name}
                      {product.version && (
                        <span className="opacity-70 ml-1">({product.version})</span>
                      )}
                    </div>
                    {(product.price1INR || product.price1) && (
                      <div className="text-xs" style={{ color: colors.text.secondary }}>
                        ₹{product.price1INR || product.price1}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <a
                href={`/category?search=${encodeURIComponent(debouncedQuery)}`}
                onClick={(e) => {
                  e.preventDefault();
                  trackSearch(debouncedQuery);
                  navigate(`/category?search=${encodeURIComponent(debouncedQuery)}`);
                  setIsDropdownOpen(false);
                  onSearch?.();
                }}
                className="block w-full text-center py-2 text-sm font-medium border-t"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                View all results for "{debouncedQuery}"
              </a>
            </>
          ) : (
            <div className="px-4 py-3 text-sm" style={{ color: colors.text.secondary }}>
              No products found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
