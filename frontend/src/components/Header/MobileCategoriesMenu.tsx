import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { MobileCategoriesMainNav } from "./MobileCategoriesMainNav";
import { MobileCategoriesBrandAccordion } from "./MobileCategoriesBrandAccordion";

const MobileCategoriesMenu: React.FC = () => {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  const handleBrandToggle = (brandKey: string) => {
    setExpandedBrand(expandedBrand === brandKey ? null : brandKey);
  };

  return (
    <div className="space-y-1">
      <MobileCategoriesMainNav navigate={navigate} colors={colors} />
      <MobileCategoriesBrandAccordion
        expandedBrand={expandedBrand}
        onToggleBrand={handleBrandToggle}
        navigate={navigate}
        colors={colors}
      />
    </div>
  );
};

export default MobileCategoriesMenu;
