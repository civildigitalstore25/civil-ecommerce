import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

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
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

// Real Adobe categories from brand-category structure
const adobeCategories: AdobeCategory[] = [
  {
    name: "Document Management",
    products: [
      { name: "Adobe Acrobat", href: "/category?brand=adobe&category=adobe-acrobat" },
    ]
  },
  {
    name: "Photography & Imaging",
    products: [
      { name: "Photoshop", href: "/category?brand=adobe&category=photoshop" },
      { name: "Lightroom", href: "/category?brand=adobe&category=lightroom" },
    ]
  },
  {
    name: "Video Production",
    products: [
      { name: "After Effect", href: "/category?brand=adobe&category=after-effect" },
      { name: "Premier Pro", href: "/category?brand=adobe&category=premier-pro" },
    ]
  },
  {
    name: "Design & Illustration",
    products: [
      { name: "Illustrator", href: "/category?brand=adobe&category=illustrator" },
      { name: "Adobe Creative Cloud", href: "/category?brand=adobe&category=adobe-creative-cloud" },
    ]
  }
];

const AdobeDropdown: React.FC<AdobeDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  buttonRef
}) => {
  const { colors } = useAdminTheme();
  const [buttonPosition, setButtonPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  const handleProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <>
      {/* Overlay click handler */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ background: 'transparent' }}
      />

      {/* Dropdown panel */}
      <div
        className="fixed z-50 rounded-xl shadow-2xl border transition-all duration-200 backdrop-blur-md"
        style={{
          backgroundColor: colors.background.primary,
          borderColor: colors.border.primary,
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
          width: 'clamp(700px, 80vw, 950px)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3
                className="text-xl md:text-2xl font-semibold"
                style={{ color: colors.text.primary }}
              >
                Adobe Products
              </h3>
              <p
                className="text-sm mt-1"
                style={{ color: colors.text.secondary }}
              >
                Explore our complete range of Adobe software solutions
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" style={{ color: colors.text.secondary }} />
            </button>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {adobeCategories.map((category, index) => (
              <div key={index} className="space-y-3">
                <h4
                  className="font-semibold text-sm uppercase tracking-wide pb-2 border-b"
                  style={{
                    color: colors.interactive.primary,
                    borderColor: colors.border.primary
                  }}
                >
                  {category.name}
                </h4>

                <ul className="space-y-2">
                  {category.products.map((product, pIndex) => (
                    <li key={pIndex}>
                      <button
                        onClick={() => handleProductClick(product.href)}
                        className="flex items-center justify-between w-full text-left px-4 py-2 rounded-lg transition-all duration-200 group text-sm md:text-base"
                        style={{ color: colors.text.secondary }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = colors.background.secondary;
                          (e.currentTarget as HTMLElement).style.color = colors.interactive.primary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
                        }}
                      >
                        <span>{product.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer button */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: colors.border.primary }}>
            <button
              onClick={() => handleProductClick('/adobe')}
              className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
            >
              View All Adobe Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdobeDropdown;
