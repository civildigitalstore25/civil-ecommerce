import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { autodeskCategories } from "./autodeskDropdown/autodeskDropdownData";
import { AutodeskDropdownCategoryList } from "./autodeskDropdown/AutodeskDropdownCategoryList";
import { AutodeskDropdownProductPanel } from "./autodeskDropdown/AutodeskDropdownProductPanel";
import { AutodeskDropdownViewAllFooter } from "./autodeskDropdown/AutodeskDropdownViewAllFooter";

interface AutodeskDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
}

const AutodeskDropdown: React.FC<AutodeskDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { colors } = useAdminTheme();
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(
    null,
  );

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    const category = autodeskCategories.find((c) => c.name === categoryName);
    if (category && category.products.length > 0) {
      onNavigate(
        category.products[0].href
          .split("&category=")[0]
          .replace("/category?", "/category?"),
      );
    }
    onClose();
  };

  return (
    <div
      className="absolute left-0 mt-[-1px] rounded-xl shadow-2xl z-50 overflow-hidden border w-[800px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex" style={{ minHeight: "400px", maxHeight: "600px" }}>
        <AutodeskDropdownCategoryList
          categories={autodeskCategories}
          hoveredCategory={hoveredCategory}
          colors={colors}
          onHoverCategory={setHoveredCategory}
          onCategoryClick={handleCategoryClick}
        />
        <AutodeskDropdownProductPanel
          categories={autodeskCategories}
          hoveredCategory={hoveredCategory}
          colors={colors}
          onProductClick={handleProductClick}
        />
      </div>

      <AutodeskDropdownViewAllFooter
        colors={colors}
        onViewAll={() => {
          onNavigate("/autodesk");
          onClose();
        }}
      />
    </div>
  );
};

export default AutodeskDropdown;
