import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import type { Product } from "../../api/types/productTypes";
import { useProducts } from "../../api/productApi";
import { useUser } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { getCategoryListingSEO } from "../../utils/seo";
import {
  normalizeFilterValue,
  type SortOption,
} from "./brandCategoryListingConstants";

export function useBrandCategoryListing() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const brand = params.get("brand") || "";
  const category = params.get("category") || "";
  const searchTerm = params.get("search") || "";

  const seoData = getCategoryListingSEO({ brand, category });

  const queryParams: {
    company?: string;
    category?: string;
    search?: string;
    limit: number;
  } = { limit: 1000 };
  if (brand) queryParams.company = brand;
  if (category) queryParams.category = category;
  if (searchTerm) queryParams.search = searchTerm;

  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts(queryParams);

  const rawProducts = (data.products || []).filter((p: Product) => {
    if (!(p.status === "active" || !p.status)) return false;

    const matchesCategory = category
      ? normalizeFilterValue(p.category || "") === normalizeFilterValue(category)
      : true;

    const productBrandValue = p.company || p.brand || "";
    const matchesBrand = brand
      ? normalizeFilterValue(productBrandValue) === normalizeFilterValue(brand)
      : true;

    return matchesCategory && matchesBrand;
  });

  const [sortBy, setSortBy] = useState<SortOption>("name-desc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const products = useMemo(() => {
    const sorted = [...rawProducts];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
      case "modified":
        return sorted.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime(),
        );
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "", undefined, {
            sensitivity: "base",
          }),
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "", undefined, {
            sensitivity: "base",
          }),
        );
      default:
        return sorted;
    }
  }, [rawProducts, sortBy]);

  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  const interactiveTint =
    colors.interactive.primary &&
    typeof colors.interactive.primary === "string" &&
    colors.interactive.primary.startsWith("linear-gradient")
      ? `${colors.interactive.secondary}20`
      : `${colors.interactive.primary}20`;

  const handleAddToCart = async (
    product: Product,
    licenseType: "1year" = "1year",
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product, licenseType, 1);
      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to add item to cart",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return {
    brand,
    category,
    searchTerm,
    seoData,
    products,
    sortBy,
    setSortBy,
    sortDropdownOpen,
    setSortDropdownOpen,
    navigate,
    colors,
    formatPriceWithSymbol,
    interactiveTint,
    handleAddToCart,
  };
}
