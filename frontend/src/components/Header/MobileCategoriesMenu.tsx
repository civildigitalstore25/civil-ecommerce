import React, { useState } from "react";
import { ChevronDown, ChevronRight, Home, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { headerConfig } from "./HeaderConfig";

// Brand-Category structure (same as AllCategoriesDropdown)
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
  ebook: {
    label: "Ebook",
    categories: [],
  },
};

const MobileCategoriesMenu: React.FC = () => {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  console.log("MobileCategoriesMenu rendered");

  const handleBrandToggle = (brandKey: string) => {
    setExpandedBrand(expandedBrand === brandKey ? null : brandKey);
  };

  const handleCategoryClick = (brand: string, category: string) => {
    navigate(`/category?brand=${brand}&category=${category}`);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/category?brand=${brand}`);
  };

  return (
    <div className="space-y-1">
      {/* Section Header */}
      <div
        className="px-3 py-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: colors.text.secondary }}
      >
        All Categories
      </div>

      {/* Main Navigation Items */}
      {headerConfig.navigation.map((item) => (
        <button
          key={item.href}
          onClick={() => navigate(item.href)}
          className="w-full flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200 text-left"
          style={{ color: colors.text.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.background.secondary;
            e.currentTarget.style.color = colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.text.primary;
          }}
        >
          <span className="font-medium text-sm flex items-center space-x-2">
            {item.label === "Home" && <Home className="w-4 h-4" />}
            {item.label === "Contact" && <Mail className="w-4 h-4" />}
            <span>{item.label}</span>
          </span>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: colors.text.secondary }}
          />
        </button>
      ))}

      {/* Divider */}
      <div
        className="my-2 border-t"
        style={{ borderColor: colors.border.primary }}
      />

      {/* Brands Accordion */}
      {Object.entries(brandCategories).map(([brandKey, brandData]) => (
        <div key={brandKey}>
          {/* Brand Header */}
          <button
            onClick={() => {
              if (brandData.categories.length > 0) {
                handleBrandToggle(brandKey);
              } else {
                handleBrandClick(brandKey);
              }
            }}
            className="w-full flex items-center justify-between px-3 py-3 rounded-md transition-all duration-200"
            style={{
              backgroundColor:
                expandedBrand === brandKey
                  ? colors.background.secondary
                  : "transparent",
            }}
            onMouseEnter={(e) => {
              if (expandedBrand !== brandKey) {
                e.currentTarget.style.backgroundColor =
                  colors.background.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (expandedBrand !== brandKey) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <span
                className="font-medium text-sm"
                style={{
                  color:
                    expandedBrand === brandKey
                      ? colors.interactive.primary
                      : colors.text.primary,
                }}
              >
                {brandData.label}
              </span>
              {brandData.categories.length > 0 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary,
                  }}
                >
                  {brandData.categories.length}
                </span>
              )}
            </div>
            {brandData.categories.length > 0 ? (
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  expandedBrand === brandKey ? "rotate-180" : ""
                }`}
                style={{
                  color:
                    expandedBrand === brandKey
                      ? colors.interactive.primary
                      : colors.text.secondary,
                }}
              />
            ) : (
              <ChevronRight
                className="w-4 h-4"
                style={{ color: colors.text.secondary }}
              />
            )}
          </button>

          {/* Categories List (Expanded) */}
          {expandedBrand === brandKey && brandData.categories.length > 0 && (
            <div
              className="ml-4 mt-1 space-y-1 border-l-2 pl-3"
              style={{ borderColor: colors.border.primary }}
            >
              {brandData.categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryClick(brandKey, category.value)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-left"
                  style={{ color: colors.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.secondary;
                    e.currentTarget.style.color = colors.interactive.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.text.secondary;
                  }}
                >
                  <span className="text-sm">{category.label}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileCategoriesMenu;
