import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { useAdminTheme } from "../contexts/AdminThemeContext";

interface SubCategory {
  name: string;
  category: string;
  displayName: string;
}

interface BrandData {
  name: string;
  displayName: string;
  description: string;
  subcategories: SubCategory[];
}

// Brand data matching the dropdown structures
const brandData: Record<string, BrandData> = {
  autodesk: {
    name: "autodesk",
    displayName: "Autodesk",
    description: "Explore Autodesk software tools designed for every industry",
    subcategories: [
      { name: "Design & CAD Software", category: "autocad", displayName: "AutoCAD" },
      { name: "Design & CAD Software", category: "autocad-lt", displayName: "AutoCAD LT" },
      { name: "Design & CAD Software", category: "autocad-mechanical", displayName: "AutoCAD Mechanical" },
      { name: "Design & CAD Software", category: "autocad-electrical", displayName: "AutoCAD Electrical" },
      { name: "Design & CAD Software", category: "autocad-mep", displayName: "AutoCAD MEP" },
      { name: "3D Modeling & Animation", category: "3ds-max", displayName: "3ds MAX" },
      { name: "3D Modeling & Animation", category: "maya", displayName: "Maya" },
      { name: "3D Modeling & Animation", category: "revit", displayName: "Revit" },
      { name: "Engineering & Manufacturing", category: "fusion", displayName: "Fusion" },
      { name: "Engineering & Manufacturing", category: "inventor-professional", displayName: "Inventor Professional" },
      { name: "Engineering & Manufacturing", category: "civil-3d", displayName: "Civil 3D" },
      { name: "Engineering & Manufacturing", category: "map-3d", displayName: "Map 3D" },
      { name: "Collections & Management", category: "aec-collection", displayName: "AEC Collection" },
      { name: "Collections & Management", category: "navisworks-manage", displayName: "Navisworks Manage" },
    ],
  },
  microsoft: {
    name: "microsoft",
    displayName: "Microsoft",
    description: "Discover Microsoft software for every business and development need",
    subcategories: [
      { name: "Productivity & Collaboration", category: "microsoft-365", displayName: "Microsoft 365" },
      { name: "Productivity & Collaboration", category: "microsoft-professional", displayName: "Microsoft Professional" },
      { name: "Project Management", category: "microsoft-projects", displayName: "Microsoft Projects" },
      { name: "Server & Enterprise", category: "server", displayName: "Server" },
      { name: "Operating Systems", category: "windows", displayName: "Windows" },
    ],
  },
  adobe: {
    name: "adobe",
    displayName: "Adobe",
    description: "Explore our complete range of Adobe software solutions",
    subcategories: [
      { name: "Document Management", category: "adobe-acrobat", displayName: "Adobe Acrobat" },
      { name: "Photography & Imaging", category: "photoshop", displayName: "Photoshop" },
      { name: "Photography & Imaging", category: "lightroom", displayName: "Lightroom" },
      { name: "Video Production", category: "after-effect", displayName: "After Effect" },
      { name: "Video Production", category: "premier-pro", displayName: "Premier Pro" },
      { name: "Design & Illustration", category: "illustrator", displayName: "Illustrator" },
      { name: "Design & Illustration", category: "adobe-creative-cloud", displayName: "Adobe Creative Cloud" },
    ],
  },
  antivirus: {
    name: "antivirus",
    displayName: "Antivirus",
    description: "Protect your devices with trusted antivirus software",
    subcategories: [
      { name: "Home & Personal Security", category: "k7-security", displayName: "K7 Security" },
      { name: "Home & Personal Security", category: "quick-heal", displayName: "Quick Heal" },
      { name: "Home & Personal Security", category: "norton", displayName: "Norton" },
      { name: "Business & Enterprise", category: "mcafee", displayName: "McAfee" },
      { name: "Business & Enterprise", category: "eset", displayName: "ESET" },
      { name: "Advanced Protection", category: "hyper-say", displayName: "Hyper Say" },
    ],
  },
};

const BrandSubcategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  
  // Get brand from current path
  const pathname = window.location.pathname.slice(1); // Remove leading slash
  const brandInfo = brandData[pathname] || null;

  if (!brandInfo) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-20 px-4"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <Package
          className="w-24 h-24 mb-4"
          style={{ color: colors.text.secondary }}
        />
        <h3
          className="text-2xl font-semibold mb-2 text-center"
          style={{ color: colors.text.primary }}
        >
          Brand Not Found
        </h3>
        <p
          className="text-lg mb-6 text-center"
          style={{ color: colors.text.secondary }}
        >
          We couldn't find this brand.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-lg transition-colors"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse,
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Group subcategories by their category name
  const groupedCategories = brandInfo.subcategories.reduce(
    (acc, sub) => {
      if (!acc[sub.name]) {
        acc[sub.name] = [];
      }
      acc[sub.name].push(sub);
      return acc;
    },
    {} as Record<string, SubCategory[]>,
  );

  const handleCategoryClick = (category: string) => {
    navigate(`/category?brand=${brandInfo.name}&category=${category}`);
  };

  const handleViewAllClick = () => {
    navigate(`/category?brand=${brandInfo.name}`);
  };

  return (
    <div
      className="min-h-screen pt-20 transition-colors duration-200"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Breadcrumb */}
        <div
          className="flex items-center text-sm mb-4 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <button
            onClick={() => navigate("/")}
            className="hover:opacity-70 transition-opacity"
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span style={{ color: colors.text.primary }}>
            {brandInfo.displayName}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {brandInfo.displayName} Products
          </h1>
          <p
            className="text-base md:text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {brandInfo.description}
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(groupedCategories).map(([categoryName, items]) => (
            <div
              key={categoryName}
              className="border rounded-xl p-5 transition-all duration-200"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 pb-2 border-b uppercase tracking-wide"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {categoryName}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.category}>
                    <button
                      onClick={() => handleCategoryClick(item.category)}
                      className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          colors.background.secondary;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          colors.text.secondary;
                      }}
                    >
                      <span className="text-sm font-medium">
                        {item.displayName}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <button
            onClick={handleViewAllClick}
            className="px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            View All {brandInfo.displayName} Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandSubcategoriesPage;
