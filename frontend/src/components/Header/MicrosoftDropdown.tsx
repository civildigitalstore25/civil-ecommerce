import React from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface MicrosoftProduct {
  name: string;
  href: string;
}

interface MicrosoftCategory {
  name: string;
  products: MicrosoftProduct[];
}

interface MicrosoftDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
}

// Real Microsoft categories from brand-category structure
const microsoftCategories: MicrosoftCategory[] = [
  {
    name: "Productivity & Collaboration",
    products: [
      {
        name: "Microsoft 365",
        href: "/category?brand=microsoft&category=microsoft-365",
      },
      {
        name: "Microsoft Professional",
        href: "/category?brand=microsoft&category=microsoft-professional",
      },
    ],
  },
  {
    name: "Project Management",
    products: [
      {
        name: "Microsoft Projects",
        href: "/category?brand=microsoft&category=microsoft-projects",
      },
    ],
  },
  {
    name: "Server & Enterprise",
    products: [
      { name: "Server", href: "/category?brand=microsoft&category=server" },
    ],
  },
  {
    name: "Operating Systems",
    products: [
      { name: "Windows", href: "/category?brand=microsoft&category=windows" },
    ],
  },
];

const MicrosoftDropdown: React.FC<MicrosoftDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { colors } = useAdminTheme();
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  const handleCategoryClick = (categoryName: string) => {
    const category = microsoftCategories.find(c => c.name === categoryName);
    if (category && category.products.length > 0) {
      onNavigate(category.products[0].href.split('&category=')[0].replace('/category?', '/category?'));
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
            {microsoftCategories.map((category, index) => (
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
                    style={{ color: colors.text.secondary }}
                  >
                    {category.products.length} products
                  </div>
                </div>
                <ChevronRight
                  className="w-5 h-5 transition-all"
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

        {/* Right: Products for Hovered Category */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: colors.background.primary }}
        >
          {hoveredCategory ? (
            <>
              <h3
                className="text-lg font-bold mb-4 pb-2 border-b uppercase tracking-wide"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {hoveredCategory}
              </h3>
              <ul className="space-y-2">
                {microsoftCategories
                  .find((c) => c.name === hoveredCategory)
                  ?.products.map((product, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => handleProductClick(product.href)}
                        className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
                        style={{ color: colors.text.secondary }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = colors.background.accent;
                          (e.currentTarget as HTMLElement).style.color = colors.interactive.primary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
                        }}
                      >
                        <span className="font-medium">{product.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{ color: colors.text.secondary }}
            >
              <p className="text-center">
                Select a category to view its products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom button */}
      <div
        className="px-6 py-4 border-t"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.primary,
        }}
      >
        <button
          onClick={() => {
            onNavigate("/microsoft");
            onClose();
          }}
          className="text-sm font-semibold transition-colors inline-flex items-center"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = colors.interactive.primary;
          }}
        >
          View All Microsoft Products
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default MicrosoftDropdown;
