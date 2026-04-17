import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../api/productApi";
import type { Product } from "../../api/types/productTypes";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { getRelatedProductsBrandKey } from "./relatedBrandCategoryMap";
import { buildRelatedProductList } from "./buildRelatedProductList";

function updateScrollButtonsStub() {
  /* reserved for optional prev/next disabled state */
}

export function useRelatedProducts(
  currentProduct: Product,
  limitProp?: number,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const brandKey = getRelatedProductsBrandKey(currentProduct);

  const { data, isLoading } = useProducts({
    company: brandKey ? brandKey : undefined,
    limit: 50,
  });

  const related = buildRelatedProductList(
    currentProduct,
    data?.products,
  );
  const displayList =
    limitProp != null && limitProp > 0 ? related.slice(0, limitProp) : related;

  const interactiveTint =
    colors.interactive.primary &&
    typeof colors.interactive.primary === "string" &&
    colors.interactive.primary.startsWith("linear-gradient")
      ? `${colors.interactive.secondary}20`
      : `${colors.interactive.primary}20`;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length <= 1) return;
    const id = setInterval(() => {
      const step = 304;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const next = Math.min(el.scrollLeft + step, maxScroll);
      el.scrollTo({ left: next, behavior: "smooth" });
      if (next >= maxScroll - 2) {
        setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 600);
      }
      updateScrollButtonsStub();
    }, 4000);
    return () => clearInterval(id);
  }, [displayList.length]);

  return {
    scrollRef,
    navigate,
    addItem,
    colors,
    formatPriceWithSymbol,
    interactiveTint,
    isLoading,
    data,
    related,
    displayList,
    onScroll: updateScrollButtonsStub,
  };
}
