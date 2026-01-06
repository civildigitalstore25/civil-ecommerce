import React, { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface AdobeProduct {
  name: string;
  href: string;
}

interface AdobeCategory {
  name: string;
  products: AdobeProduct[];
}

interface AdobeDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
}

// Real Adobe categories from brand-category structure
const adobeCategories: AdobeCategory[] = [
  {
    name: "Document Management",
    products: [
      {
        name: "Adobe Acrobat",
        href: "/category?brand=adobe&category=adobe-acrobat",
      },
    ],
  },
  {
    name: "Photography & Imaging",
    products: [
      { name: "Photoshop", href: "/category?brand=adobe&category=photoshop" },
      { name: "Lightroom", href: "/category?brand=adobe&category=lightroom" },
    ],
  },
  {
    name: "Video Production",
    products: [
      {
        name: "After Effect",
        href: "/category?brand=adobe&category=after-effect",
      },
      {
        name: "Premier Pro",
        href: "/category?brand=adobe&category=premier-pro",
      },
    ],
  },
  {
    name: "Design & Illustration",
    products: [
      {
        name: "Illustrator",
        href: "/category?brand=adobe&category=illustrator",
      },
      {
        name: "Adobe Creative Cloud",
        href: "/category?brand=adobe&category=adobe-creative-cloud",
      },
    ],
  },
];

const AdobeDropdown: React.FC<AdobeDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { colors } = useAdminTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  // Render absolutely positioned dropdown under the parent menu button
  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 mt-[-1pxa] rounded-xl shadow-2xl z-50 overflow-hidden border all-categories-dropdown"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
        minWidth: "900px",
        maxWidth: "1200px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3
            className="text-2xl font-semibold"
            style={{ color: colors.text.primary }}
          >
            Adobe Product Categories
          </h3>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
            Explore Adobe software tools designed for every industry
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {adobeCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h4
                className="font-semibold text-base uppercase tracking-wide pb-2 border-b"
                style={{
                  color: colors.text.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {category.name}
              </h4>

              <ul className="space-y-2">
                {category.products.map((product, pIndex) => (
                  <li key={pIndex} className="group">
                    <button
                      onClick={() => handleProductClick(product.href)}
                      className="flex items-center justify-between w-full text-left px-4 py-3 rounded-md transition-all duration-200 group-hover:scale-[1.02]"
                      style={{
                        backgroundColor: colors.background.secondary,
                        color: colors.text.secondary,
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLElement
                        ).style.backgroundColor = colors.background.accent;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.interactive.primary;
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLElement
                        ).style.backgroundColor = colors.background.secondary;
                        (e.currentTarget as HTMLElement).style.color =
                          colors.text.secondary;
                      }}
                    >
                      <span className="text-[15px] font-medium group-hover:text-[16px] transition-all">
                        {product.name}
                      </span>
                      <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom button */}
        <div
          className="mt-8 pt-6 border-t flex justify-center"
          style={{ borderColor: colors.border.primary }}
        >
          <button
            onClick={() => handleProductClick("/adobe")}
            className="py-3 px-6 rounded-lg font-medium transition-all duration-200 text-lg"
            style={{
              backgroundColor: colors.text.primary,
              color: colors.text.inverse,
            }}
          >
            View All Adobe Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdobeDropdown;
