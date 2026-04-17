import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { BrandSubcategoriesNotFound } from "./brandSubcategories/BrandSubcategoriesNotFound";
import { BrandSubcategoriesBrandView } from "./brandSubcategories/BrandSubcategoriesBrandView";
import { useBrandSubcategoriesRoute } from "./brandSubcategories/useBrandSubcategoriesRoute";

const BrandSubcategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const brandInfo = useBrandSubcategoriesRoute();

  if (!brandInfo) {
    return <BrandSubcategoriesNotFound colors={colors} navigate={navigate} />;
  }

  return (
    <BrandSubcategoriesBrandView
      brandInfo={brandInfo}
      colors={colors}
      navigate={navigate}
    />
  );
};

export default BrandSubcategoriesPage;
