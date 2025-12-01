import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { log } from "console";

interface MicrosoftSubProduct {
  name: string;
  href: string;
}

interface MicrosoftProduct {
  name: string;
  href: string;
  topProducts?: MicrosoftSubProduct[];
}

interface MicrosoftCategory {
  name: string;
  products: MicrosoftProduct[];
}

interface MicrosoftDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
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
];

const MicrosoftDropdown: React.FC<MicrosoftDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  buttonRef,
}) => {
  const { colors } = useAdminTheme();
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Helper to update dropdown position
  const updatePosition = () => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      console.log("Button position:", rect);
    }
  };

  useEffect(() => {
    updatePosition();
    if (!isOpen) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
    // eslint-disable-next-line
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = (delay = 180) => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveProduct(null);
      closeTimeoutRef.current = null;
    }, delay);
  };

  const handleProductClick = (href: string, hasTopProducts?: boolean) => {
    if (hasTopProducts) {
      setActiveProduct((prev) => (prev === href ? null : href));
      return;
    }
    onNavigate(href);
    onClose();
  };

  const handleSubProductClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <div
      className="absolute left-0 top-full mt-2 rounded-xl shadow-2xl border z-50 backdrop-blur-sm"
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
            Microsoft Product Categories
          </h3>
          <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>
            Discover Microsoft software for every business and development need
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
          {microsoftCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h4
                className="font-semibold text-base uppercase tracking-wide pb-2 border-b"
                style={{
                  color: colors.interactive.primary,
                  borderColor: colors.border.primary,
                }}
              >
                {category.name}
              </h4>

              <ul className="space-y-2">
                {category.products.map((product, pIndex) => {
                  const isSubOpen = activeProduct === product.href;
                  return (
                    <li
                      key={pIndex}
                      className="relative group"
                      onMouseEnter={() => {
                        clearCloseTimeout();
                        setActiveProduct(product.href);
                      }}
                      onMouseLeave={() => scheduleClose()}
                    >
                      <button
                        onClick={() =>
                          handleProductClick(
                            product.href,
                            !!product.topProducts,
                          )
                        }
                        className="flex items-center justify-between w-full text-left px-4 py-3 rounded-md transition-all duration-200 group-hover:scale-[1.02]"
                        style={{
                          backgroundColor: colors.background.secondary,
                          color: colors.text.secondary,
                        }}
                      >
                        <span className="text-[15px] font-medium group-hover:text-[16px] transition-all">
                          {product.name}
                        </span>
                        {product.topProducts && (
                          <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>

                      {/* Sub-products popup */}
                      {isSubOpen && product.topProducts && (
                        <div
                          className="absolute rounded-lg shadow-2xl border p-6 transition-all duration-150"
                          style={{
                            backgroundColor: colors.background.primary,
                            borderColor: colors.border.primary,
                            top: 0,
                            left: "calc(100% + 16px)",
                            minWidth: "350px",
                            zIndex: 60,
                          }}
                          onMouseEnter={() => clearCloseTimeout()}
                          onMouseLeave={() => scheduleClose()}
                        >
                          <h4
                            className="font-semibold text-base pb-2 mb-3 border-b"
                            style={{
                              color: colors.interactive.primary,
                              borderColor: colors.border.primary,
                            }}
                          >
                            Top {product.name} Products
                          </h4>

                          <ul className="space-y-2">
                            {product.topProducts.map((sub, i) => (
                              <li key={i}>
                                <button
                                  onClick={() =>
                                    handleSubProductClick(sub.href)
                                  }
                                  className="flex items-center justify-between w-full text-left px-3 py-2 rounded-md transition-all duration-200 group"
                                  style={{ color: colors.text.secondary }}
                                >
                                  <span className="text-[14px]">
                                    {sub.name}
                                  </span>
                                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
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
            onClick={() => {
              onNavigate("/microsoft");
              onClose();
            }}
            className="py-3 px-6 rounded-lg font-medium transition-all duration-200 text-lg"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            View All Microsoft Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicrosoftDropdown;
