import React, { useState } from "react";
import type { RefObject } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import "./AllCategoriesDropdown.css";

// Brand-Category structure (same as AddProductModal)
const brandCategories: Record<
  string,
  { label: string; categories: { value: string; label: string }[] }
> = {
  autodesk: {
    label: "Autodesk",
    categories: [
      { value: "autocad", label: "AutoCAD" },
      { value: "3ds-max", label: "3ds MAX" },
      { value: "revit", label: "Revit" },
      { value: "maya", label: "Maya" },
      { value: "fusion", label: "Fusion" },
      { value: "navisworks-manage", label: "Navisworks Manage" },
      { value: "inventor-professional", label: "Inventor Professional" },
      { value: "autocad-lt", label: "AutoCAD LT" },
      { value: "aec-collection", label: "AEC Collection" },
      { value: "civil-3d", label: "Civil 3D" },
      { value: "map-3d", label: "Map 3D" },
      { value: "autocad-mechanical", label: "AutoCAD Mechanical" },
      { value: "autocad-electrical", label: "AutoCAD Electrical" },
      { value: "autocad-mep", label: "AutoCAD MEP" },
    ],
  },
  microsoft: {
    label: "Microsoft",
    categories: [
      { value: "microsoft-365", label: "Microsoft 365" },
      { value: "microsoft-professional", label: "Microsoft Professional" },
      { value: "microsoft-projects", label: "Microsoft Projects" },
      { value: "server", label: "Server" },
      { value: "windows", label: "Windows" },
    ],
  },
  adobe: {
    label: "Adobe",
    categories: [
      { value: "adobe-acrobat", label: "Adobe Acrobat" },
      { value: "photoshop", label: "Photoshop" },
      { value: "lightroom", label: "Lightroom" },
      { value: "after-effect", label: "After Effect" },
      { value: "premier-pro", label: "Premier Pro" },
      { value: "illustrator", label: "Illustrator" },
      { value: "adobe-creative-cloud", label: "Adobe Creative Cloud" },
    ],
  },
  coreldraw: {
    label: "Coreldraw",
    categories: [
      { value: "coreldraw-graphics-suite", label: "Coreldraw Graphics Suite" },
      {
        value: "coreldraw-technical-suite",
        label: "Coreldraw Technical Suite",
      },
    ],
  },
  antivirus: {
    label: "Antivirus",
    categories: [
      { value: "k7-security", label: "K7 Security" },
      { value: "quick-heal", label: "Quick Heal" },
      { value: "hyper-say", label: "Hyper Say" },
      { value: "norton", label: "Norton" },
      { value: "mcafee", label: "McAfee" },
      { value: "eset", label: "ESET" },
    ],
  },
  "structural-softwares": {
    label: "Structural Softwares",
    categories: [
      { value: "e-tab", label: "E-Tab" },
      { value: "safe", label: "Safe" },
      { value: "sap-2000", label: "Sap 2000" },
      { value: "tekla", label: "Tekla" },
    ],
  },
  "architectural-softwares": {
    label: "Architectural Softwares",
    categories: [
      { value: "lumion", label: "Lumion" },
      { value: "twin-motion", label: "Twin Motion" },
      { value: "d5-render", label: "D5 Render" },
      { value: "archi-cad", label: "Archi CAD" },
    ],
  },
  "billing-software": {
    label: "Billing Software",
    categories: [
      { value: "tally", label: "Tally" },
      { value: "vyapar", label: "Vyapar" },
    ],
  },
  ebook: {
    label: "Ebook",
    categories: [],
  },
};


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
  buttonRef
}) => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const { colors } = useAdminTheme();

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef?.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const handleCategoryClick = (brand: string, category: string) => {
    onNavigate(`/category?brand=${brand}&category=${category}`);
    onClose();
  };

  const handleBrandClick = (brand: string) => {
    onNavigate(`/category?brand=${brand}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 mt-[-1] rounded-xl shadow-2xl z-50 overflow-hidden border w-[800px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
      ref={buttonRef as React.RefObject<HTMLDivElement>}
    >
      {/* Header removed for compactness */}

      {/* Brands Side Menu + Categories Content */}
      <div className="flex" style={{ minHeight: "400px", maxHeight: "600px" }}>
        {/* Left: Brands List */}
        <div
          className="w-80 border-r"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <div className="py-2">
            {Object.entries(brandCategories).map(([brandKey, brandData]) => (
              <button
                key={brandKey}
                onMouseEnter={() => setHoveredBrand(brandKey)}
                onClick={() => handleBrandClick(brandKey)}
                className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group brand-item border-l-4"
                style={{
                  backgroundColor:
                    hoveredBrand === brandKey
                      ? colors.background.accent
                      : "transparent",
                  borderLeftColor:
                    hoveredBrand === brandKey
                      ? colors.interactive.primary
                      : "transparent",
                }}
              >
                <div>
                  <div
                    className="font-semibold text-base mb-0.5"
                    style={{
                      color:
                        hoveredBrand === brandKey
                          ? colors.interactive.primary
                          : colors.text.primary,
                    }}
                  >
                    {brandData.label}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    {brandData.categories.length}{" "}
                    {brandData.categories.length === 1 ? "product" : "products"}
                  </div>
                </div>
                {brandData.categories.length > 0 && (
                  <ChevronRight
                    className="w-5 h-5 transition-all"
                    style={{
                      color:
                        hoveredBrand === brandKey
                          ? colors.interactive.primary
                          : colors.text.secondary,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Categories Grid */}
        <div
          className="flex-1"
          style={{ backgroundColor: colors.background.primary }}
        >
          {hoveredBrand &&
            brandCategories[hoveredBrand] &&
            brandCategories[hoveredBrand].categories.length > 0 ? (
            <div
              className="p-6 category-dropdown-section"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              {/* Section Header */}
              <div className="mb-4">
                <h4
                  className="text-lg font-bold uppercase tracking-wider mb-1"
                  style={{
                    color: colors.interactive.primary,
                  }}
                >
                  {brandCategories[hoveredBrand].label} Products
                </h4>
                <div
                  className="h-1 w-16 rounded"
                  style={{
                    backgroundColor: colors.interactive.primary,
                  }}
                ></div>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-2">
                {brandCategories[hoveredBrand].categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() =>
                      handleCategoryClick(hoveredBrand, category.value)
                    }
                    className="px-4 py-3 text-left transition-all duration-150 flex items-center justify-between group category-item rounded-lg"
                    style={{ backgroundColor: colors.background.secondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.secondary;
                    }}
                  >
                    <span
                      className="font-medium transition-colors"
                      style={{ color: colors.text.primary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.primary;
                      }}
                    >
                      {category.label}
                    </span>
                    <ChevronRight
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                          colors.interactive.primary;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : hoveredBrand ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-lg" style={{ color: colors.text.secondary }}>
                  No categories available for{" "}
                  {brandCategories[hoveredBrand]?.label}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full p-4">
              <span style={{ color: colors.text.secondary, fontSize: 14 }}>
                Select a brand to view its products
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesDropdown;
