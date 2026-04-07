import React, { useState, type RefObject } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import "./AllCategoriesDropdown.css";
import { useAllCategoriesClickOutside } from "./allCategoriesDropdown/useAllCategoriesClickOutside";
import { AllCategoriesDropdownBody } from "./allCategoriesDropdown/AllCategoriesDropdownBody";

interface AllCategoriesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef?: RefObject<HTMLElement | null>;
}

const AllCategoriesDropdown: React.FC<AllCategoriesDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  buttonRef,
}) => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const { colors } = useAdminTheme();

  useAllCategoriesClickOutside(isOpen, onClose, buttonRef);

  if (!isOpen) return null;

  const handleCategoryClick = (brand: string, category: string) => {
    onNavigate(`/category?brand=${brand}&category=${category}`);
    onClose();
  };

  const handleBrandClick = (brand: string) => {
    onNavigate(`/category?brand=${brand}`);
    onClose();
  };

  return (
    <div
      className="absolute left-0 mt-[-1] rounded-xl shadow-2xl z-50 overflow-hidden border w-[800px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
      ref={buttonRef as React.RefObject<HTMLDivElement>}
    >
      <AllCategoriesDropdownBody
        colors={colors}
        hoveredBrand={hoveredBrand}
        onHoverBrand={setHoveredBrand}
        onBrandClick={handleBrandClick}
        onCategoryClick={handleCategoryClick}
      />
    </div>
  );
};

export default AllCategoriesDropdown;
