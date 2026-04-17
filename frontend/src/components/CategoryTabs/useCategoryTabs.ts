import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../api/productApi";
import { useUser } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import Swal from "sweetalert2";
import type { Product } from "../../api/types/productTypes";
import { CATEGORY_TABS } from "./categoryTabsConfig";
import { sortProductsForCategoryTabs } from "./sortCategoryTabProducts";

export function useCategoryTabs() {
  const [activeTab, setActiveTab] = useState(CATEGORY_TABS[0].id);
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  const activeCategory = CATEGORY_TABS.find((tab) => tab.id === activeTab);
  const companyFilter = activeCategory?.company || "";
  const categoryFilter = activeCategory?.category || "";

  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts({
      company: companyFilter,
      ...(categoryFilter ? { category: categoryFilter } : {}),
      limit: 6,
    });

  const allProducts = data.products || [];
  const displayedProducts = sortProductsForCategoryTabs(allProducts);

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
    activeTab,
    setActiveTab,
    colors,
    displayedProducts,
    interactiveTint,
    formatPriceWithSymbol,
    navigate,
    handleAddToCart,
  };
}
