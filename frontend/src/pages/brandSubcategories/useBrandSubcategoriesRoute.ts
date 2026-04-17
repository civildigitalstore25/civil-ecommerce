import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { brandSubcategoriesBySlug } from "./brandSubcategoriesData";
import type { BrandData } from "./brandSubcategoriesTypes";

export function useBrandSubcategoriesRoute(): BrandData | null {
  const location = useLocation();

  return useMemo(() => {
    const slug = location.pathname.replace(/^\//, "");
    return brandSubcategoriesBySlug[slug] ?? null;
  }, [location.pathname]);
}
