import React, { useState } from "react";
import { ChevronRight, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface Category {
  id: string;
  name: string;
  href?: string;
  subcategories?: { id: string; name: string; href: string }[];
}

// Static navigation menu matching header navigation
const navigationCategories: Category[] = [
  {
    id: "autodesk",
    name: "Autodesk",
    href: "/autodesk",
    subcategories: [
      { id: "autocad", name: "AutoCAD", href: "/category?brand=autodesk&category=autocad" },
      { id: "3ds-max", name: "3ds MAX", href: "/category?brand=autodesk&category=3ds-max" },
      { id: "revit", name: "Revit", href: "/category?brand=autodesk&category=revit" },
      { id: "maya", name: "Maya", href: "/category?brand=autodesk&category=maya" },
      { id: "fusion", name: "Fusion", href: "/category?brand=autodesk&category=fusion" },
      { id: "navisworks-manage", name: "Navisworks Manage", href: "/category?brand=autodesk&category=navisworks-manage" },
      { id: "inventor-professional", name: "Inventor Professional", href: "/category?brand=autodesk&category=inventor-professional" },
      { id: "autocad-lt", name: "AutoCAD LT", href: "/category?brand=autodesk&category=autocad-lt" },
      { id: "aec-collection", name: "AEC Collection", href: "/category?brand=autodesk&category=aec-collection" },
      { id: "civil-3d", name: "Civil 3D", href: "/category?brand=autodesk&category=civil-3d" },
      { id: "map-3d", name: "Map 3D", href: "/category?brand=autodesk&category=map-3d" },
      { id: "autocad-mechanical", name: "AutoCAD Mechanical", href: "/category?brand=autodesk&category=autocad-mechanical" },
      { id: "autocad-electrical", name: "AutoCAD Electrical", href: "/category?brand=autodesk&category=autocad-electrical" },
      { id: "autocad-mep", name: "AutoCAD MEP", href: "/category?brand=autodesk&category=autocad-mep" },
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    href: "/microsoft",
    subcategories: [
      { id: "microsoft-365", name: "Microsoft 365", href: "/category?brand=microsoft&category=microsoft-365" },
      { id: "microsoft-professional", name: "Microsoft Professional", href: "/category?brand=microsoft&category=microsoft-professional" },
      { id: "microsoft-projects", name: "Microsoft Projects", href: "/category?brand=microsoft&category=microsoft-projects" },
      { id: "server", name: "Server", href: "/category?brand=microsoft&category=server" },
      { id: "windows", name: "Windows", href: "/category?brand=microsoft&category=windows" },
    ],
  },
  {
    id: "adobe",
    name: "Adobe",
    href: "/adobe",
    subcategories: [
      { id: "adobe-acrobat", name: "Adobe Acrobat", href: "/category?brand=adobe&category=adobe-acrobat" },
      { id: "photoshop", name: "Photoshop", href: "/category?brand=adobe&category=photoshop" },
      { id: "lightroom", name: "Lightroom", href: "/category?brand=adobe&category=lightroom" },
      { id: "after-effect", name: "After Effect", href: "/category?brand=adobe&category=after-effect" },
      { id: "premier-pro", name: "Premier Pro", href: "/category?brand=adobe&category=premier-pro" },
      { id: "illustrator", name: "Illustrator", href: "/category?brand=adobe&category=illustrator" },
      { id: "adobe-creative-cloud", name: "Adobe Creative Cloud", href: "/category?brand=adobe&category=adobe-creative-cloud" },
    ],
  },
  {
    id: "coreldraw",
    name: "Coreldraw",
    href: "/category?brand=coreldraw",
    subcategories: [
      { id: "coreldraw-graphics-suite", name: "Coreldraw Graphics Suite", href: "/category?brand=coreldraw&category=coreldraw-graphics-suite" },
      { id: "coreldraw-technical-suite", name: "Coreldraw Technical Suite", href: "/category?brand=coreldraw&category=coreldraw-technical-suite" },
    ],
  },
  {
    id: "antivirus",
    name: "Antivirus",
    href: "/antivirus",
    subcategories: [
      { id: "k7-security", name: "K7 Security", href: "/category?brand=antivirus&category=k7-security" },
      { id: "quick-heal", name: "Quick Heal", href: "/category?brand=antivirus&category=quick-heal" },
      { id: "hyper-say", name: "Hyper Say", href: "/category?brand=antivirus&category=hyper-say" },
      { id: "norton", name: "Norton", href: "/category?brand=antivirus&category=norton" },
      { id: "mcafee", name: "McAfee", href: "/category?brand=antivirus&category=mcafee" },
      { id: "eset", name: "ESET", href: "/category?brand=antivirus&category=eset" },
    ],
  },
  {
    id: "structural-softwares",
    name: "Structural Softwares",
    href: "/category?brand=structural-softwares",
    subcategories: [
      { id: "e-tab", name: "E-Tab", href: "/category?brand=structural-softwares&category=e-tab" },
      { id: "safe", name: "Safe", href: "/category?brand=structural-softwares&category=safe" },
      { id: "sap-2000", name: "Sap 2000", href: "/category?brand=structural-softwares&category=sap-2000" },
      { id: "tekla", name: "Tekla", href: "/category?brand=structural-softwares&category=tekla" },
    ],
  },
  {
    id: "architectural-softwares",
    name: "Architectural Softwares",
    href: "/category?brand=architectural-softwares",
    subcategories: [
      { id: "lumion", name: "Lumion", href: "/category?brand=architectural-softwares&category=lumion" },
      { id: "twin-motion", name: "Twin Motion", href: "/category?brand=architectural-softwares&category=twin-motion" },
      { id: "d5-render", name: "D5 Render", href: "/category?brand=architectural-softwares&category=d5-render" },
      { id: "archi-cad", name: "Archi CAD", href: "/category?brand=architectural-softwares&category=archi-cad" },
    ],
  },
  {
    id: "billing-software",
    name: "Billing Software",
    href: "/category?brand=billing-software",
    subcategories: [
      { id: "tally", name: "Tally", href: "/category?brand=billing-software&category=tally" },
    ],
  },
  {
    id: "ebook",
    name: "Ebook",
    href: "/category?brand=ebook",
  },
  {
    id: "about",
    name: "About Us",
    href: "/about",
  },
  {
    id: "contact",
    name: "Contact",
    href: "/contact",
  },
];

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-[calc(100vh-80px)]
          transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0 lg:w-80" : "-translate-x-full lg:translate-x-0 lg:w-0"}
          w-80
          overflow-y-auto
          shadow-lg
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
          z-50
        `}
        style={{
          backgroundColor: colors.background.primary,
          borderRight: isOpen ? `1px solid ${colors.border.primary}` : 'none',
        }}
      >
        {/* Desktop Toggle Button - Positioned at bottom center - Only visible when open */}
        {isOpen && (
          <button
            onClick={onToggle}
            className="
              hidden lg:flex
              absolute bottom-8 left-1/2 -translate-x-1/2
              w-12 h-12
              items-center justify-center
              rounded-full
              shadow-2xl
              hover:shadow-2xl
              hover:scale-110
              transition-all duration-300
              z-[60]
              bg-blue-600 hover:bg-blue-700
            "
            title="Close sidebar"
          >
            <ChevronLeft className="w-6 h-6 text-white font-bold" strokeWidth={3} />
          </button>
        )}

        {/* Mobile Header */}
        <div
          className="lg:hidden flex items-center justify-end p-4 border-b"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.background.primary }}
          >
            <X className="w-5 h-5" style={{ color: colors.text.primary }} />
          </button>
        </div>



        {/* Categories List - Only show when sidebar is open */}
        {isOpen && (
          <nav className="p-2">
            {navigationCategories.map((category) => (
              <div key={category.id} className="mb-1">
                {/* Category Header */}
                <button
                  onClick={() => category.subcategories && category.subcategories.length > 0 ? toggleCategory(category.id) : handleNavigation(category.href || '/')}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:shadow-md group"
                  style={{
                    backgroundColor: expandedCategories.includes(category.id)
                      ? colors.background.secondary
                      : "transparent",
                    color: colors.text.primary,
                  }}
                >
                  <span className="font-medium text-left group-hover:translate-x-1 transition-transform duration-200">
                    {category.name}
                  </span>
                  {category.subcategories && category.subcategories.length > 0 && (
                    <span className="transition-transform duration-200">
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      ) : (
                        <ChevronRight
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      )}
                    </span>
                  )}
                </button>

                {/* SubCategories */}
                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  expandedCategories.includes(category.id) && (
                    <div
                      className="ml-4 mt-1 mb-2 border-l-2 pl-2 animate-slideDown"
                      style={{ borderColor: colors.border.primary }}
                    >
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleNavigation(subcategory.href)}
                          className="w-full text-left p-2 pl-3 rounded-md transition-all duration-200 hover:shadow-sm hover:pl-4 mb-1 group"
                          style={{ color: colors.text.secondary }}
                        >
                          <span className="group-hover:font-medium transition-all duration-200">
                            {subcategory.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        )}
      </aside>
    </>
  );
};

export default LeftSidebar;
