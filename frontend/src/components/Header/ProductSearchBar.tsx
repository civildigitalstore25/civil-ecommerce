import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { headerConfig } from "./HeaderConfig";
import { trackSearch } from "../../utils/analytics";

interface ProductSearchBarProps {
  className?: string;
  onSearch?: () => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  className = "",
  onSearch,
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useAdminTheme();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || "";
    setQuery(searchTerm);
  }, [location.pathname, location.search]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    trackSearch(trimmed);
    navigate(`/category?search=${encodeURIComponent(trimmed)}`);
    onSearch?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: colors.text.secondary }}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={headerConfig.search.placeholder}
        className="w-full h-10 pl-9 pr-3 rounded-lg border text-sm outline-none transition-colors duration-200"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          color: colors.text.primary,
        }}
      />
    </form>
  );
};

export default ProductSearchBar;
