import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { useAdminTheme } from "../contexts/AdminThemeContext";

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

const AllProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const handleCategoryClick = (brand: string, category: string) => {
    navigate(`/category?brand=${brand}&category=${category}`);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/category?brand=${brand}`);
  };

  const toggleBrand = (brand: string) => {
    setExpandedBrand(expandedBrand === brand ? null : brand);
  };

  return (
    <div
      className="min-h-screen pt-20 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div
          className="flex items-center text-sm mb-6 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-70 transition-opacity"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span style={{ color: colors.text.primary }}>All Products</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-3 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            Software Product Categories
          </h1>
          <p
            className="text-base md:text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            Explore professional software tools designed for every industry
          </p>
        </div>

        {/* Desktop View - Side by Side */}
        <div className="hidden md:flex gap-6">
          {/* Left: Brands List */}
          <div
            className="w-80 rounded-xl border overflow-hidden sticky top-24"
            style={{
              backgroundColor: colors.background.primary,
              borderColor: colors.border.primary,
              maxHeight: "calc(100vh - 120px)",
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{
                borderColor: colors.border.primary,
                backgroundColor: colors.background.secondary,
              }}
            >
              <h3
                className="text-lg font-bold"
                style={{ color: colors.text.primary }}
              >
                Browse by Brand
              </h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
              {Object.entries(brandCategories).map(([brandKey, brandData]) => (
                <button
                  key={brandKey}
                  onClick={() => toggleBrand(brandKey)}
                  className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4 hover:scale-[1.01]"
                  style={{
                    backgroundColor:
                      expandedBrand === brandKey
                        ? colors.background.accent
                        : "transparent",
                    borderLeftColor:
                      expandedBrand === brandKey
                        ? colors.interactive.primary
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
                  <div>
                    <div
                      className="font-semibold text-base mb-0.5"
                      style={{
                        color:
                          expandedBrand === brandKey
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
                  <ChevronRight
                    className="w-5 h-5 transition-all"
                    style={{
                      color:
                        expandedBrand === brandKey
                          ? colors.interactive.primary
                          : colors.text.secondary,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Categories Display */}
          <div className="flex-1">
            {expandedBrand ? (
              <div
                className="rounded-xl border p-6"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {/* Brand Header */}
                <div className="mb-6 pb-4 border-b" style={{ borderColor: colors.border.primary }}>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.text.primary }}
                  >
                    {brandCategories[expandedBrand].label}
                  </h2>
                  <button
                    onClick={() => handleBrandClick(expandedBrand)}
                    className="text-sm font-medium transition-colors duration-200 inline-flex items-center"
                    style={{ color: colors.interactive.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    View All {brandCategories[expandedBrand].label} Products
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Categories Grid */}
                {brandCategories[expandedBrand].categories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {brandCategories[expandedBrand].categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() =>
                          handleCategoryClick(expandedBrand, category.value)
                        }
                        className="px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group rounded-lg hover:scale-[1.02]"
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
                          className="font-medium text-sm"
                          style={{ color: colors.text.primary }}
                        >
                          {category.label}
                        </span>
                        <ChevronRight
                          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: colors.interactive.primary }}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: colors.text.secondary }}
                    />
                    <p style={{ color: colors.text.secondary }}>
                      No categories available
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="rounded-xl border p-12 text-center"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <div className="text-6xl mb-4">👈</div>
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: colors.text.primary }}
                >
                  Select a brand to see products
                </p>
                <p
                  className="text-sm"
                  style={{ color: colors.text.secondary }}
                >
                  Choose from 8 professional software brands
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View - Accordion */}
        <div className="md:hidden space-y-3">
          {Object.entries(brandCategories).map(([brandKey, brandData]) => (
            <div
              key={brandKey}
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              {/* Brand Header */}
              <button
                onClick={() => toggleBrand(brandKey)}
                className="w-full px-4 py-4 flex items-center justify-between transition-colors duration-200"
                style={{
                  backgroundColor:
                    expandedBrand === brandKey
                      ? colors.background.accent
                      : colors.background.secondary,
                }}
              >
                <div className="text-left">
                  <div
                    className="font-semibold text-base mb-1"
                    style={{ color: colors.text.primary }}
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
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-200 ${
                    expandedBrand === brandKey ? "rotate-90" : ""
                  }`}
                  style={{ color: colors.text.secondary }}
                />
              </button>

              {/* Categories List */}
              {expandedBrand === brandKey && (
                <div className="px-4 pb-4 pt-2 space-y-2">
                  <button
                    onClick={() => handleBrandClick(brandKey)}
                    className="w-full px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor: colors.interactive.primary,
                      color: colors.text.inverse,
                    }}
                  >
                    View All {brandData.label} Products
                  </button>
                  {brandData.categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategoryClick(brandKey, category.value)}
                      className="w-full px-3 py-2 text-left text-sm rounded-lg transition-colors duration-200 flex items-center justify-between"
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
                      <span style={{ color: colors.text.primary }}>
                        {category.label}
                      </span>
                      <ChevronRight
                        className="w-4 h-4"
                        style={{ color: colors.text.secondary }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
