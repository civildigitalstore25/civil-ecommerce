import React from "react";
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
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    const category = adobeCategories.find(c => c.name === categoryName);
    if (category && category.products.length > 0) {
      onNavigate(category.products[0].href.split('&category=')[0].replace('/category?', '/category?'));
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 mt-[-1px] rounded-xl shadow-2xl z-50 overflow-hidden border w-[800px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      {/* Two-panel layout */}
      <div className="flex" style={{ minHeight: "400px", maxHeight: "600px" }}>
        {/* Left: Categories List */}
        <div
          className="w-80 border-r"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <div className="py-2">
            {adobeCategories.map((category, index) => (
              <button
                key={index}
                onMouseEnter={() => setHoveredCategory(category.name)}
                onClick={() => handleCategoryClick(category.name)}
                className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4"
                style={{
                  backgroundColor:
                    hoveredCategory === category.name
                      ? colors.background.accent
                      : "transparent",
                  borderLeftColor:
                    hoveredCategory === category.name
                      ? colors.interactive.primary
                      : "transparent",
                }}
              >
                <div>
                  <div
                    className="font-semibold text-base mb-0.5"
                    style={{
                      color:
                        hoveredCategory === category.name
                          ? colors.interactive.primary
                          : colors.text.primary,
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      color: colors.text.secondary,
                    }}
                  >
                    {category.products.length} product{category.products.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <ChevronRight
                  className="w-5 h-5 transition-transform"
                  style={{
                    color:
                      hoveredCategory === category.name
                        ? colors.interactive.primary
                        : colors.text.secondary,
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Products List */}
        <div className="flex-1 overflow-y-auto">
          {hoveredCategory ? (
            <div className="p-4">
              <h3
                className="text-lg font-bold mb-4 px-2"
                style={{ color: colors.text.primary }}
              >
                {hoveredCategory}
              </h3>
              <div className="space-y-1">
                {adobeCategories
                  .find((cat) => cat.name === hoveredCategory)
                  ?.products.map((product, pIndex) => (
                    <button
                      key={pIndex}
                      onClick={() => handleProductClick(product.href)}
                      className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
                      style={{
                        color: colors.text.secondary,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          colors.background.accent;
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
                      <span className="font-medium">{product.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{ color: colors.text.secondary }}
            >
              <p className="text-center px-8">Hover over a category to view products</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom button */}
      <div
        className="border-t flex justify-center py-4"
        style={{ borderColor: colors.border.primary }}
      >
        <button
          onClick={() => handleProductClick("/adobe")}
          className="py-3 px-8 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: colors.interactive.primary,
            color: colors.text.inverse,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = "1";
          }}
        >
          View All Adobe Products
        </button>
      </div>
    </div>
  );
};

export default AdobeDropdown;
