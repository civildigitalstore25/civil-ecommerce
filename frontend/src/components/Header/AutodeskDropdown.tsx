import React, { useState, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface AutodeskSubProduct {
  name: string;
  href: string;
}

interface AutodeskProduct {
  name: string;
  href: string;
  topProducts?: AutodeskSubProduct[];
}

interface AutodeskCategory {
  name: string;
  products: AutodeskProduct[];
}

interface AutodeskDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
}

// Real Autodesk categories from brand-category structure
const autodeskCategories: AutodeskCategory[] = [
  {
    name: "Design & CAD Software",
    products: [
      { name: "AutoCAD", href: "/category?brand=autodesk&category=autocad" },
      {
        name: "AutoCAD LT",
        href: "/category?brand=autodesk&category=autocad-lt",
      },
      {
        name: "AutoCAD Mechanical",
        href: "/category?brand=autodesk&category=autocad-mechanical",
      },
      {
        name: "AutoCAD Electrical",
        href: "/category?brand=autodesk&category=autocad-electrical",
      },
      {
        name: "AutoCAD MEP",
        href: "/category?brand=autodesk&category=autocad-mep",
      },
    ],
  },
  {
    name: "3D Modeling & Animation",
    products: [
      { name: "3ds MAX", href: "/category?brand=autodesk&category=3ds-max" },
      { name: "Maya", href: "/category?brand=autodesk&category=maya" },
      { name: "Revit", href: "/category?brand=autodesk&category=revit" },
    ],
  },
  {
    name: "Engineering & Manufacturing",
    products: [
      { name: "Fusion", href: "/category?brand=autodesk&category=fusion" },
      {
        name: "Inventor Professional",
        href: "/category?brand=autodesk&category=inventor-professional",
      },
      { name: "Civil 3D", href: "/category?brand=autodesk&category=civil-3d" },
      { name: "Map 3D", href: "/category?brand=autodesk&category=map-3d" },
    ],
  },
  {
    name: "Collections & Management",
    products: [
      {
        name: "AEC Collection",
        href: "/category?brand=autodesk&category=aec-collection",
      },
      {
        name: "Navisworks Manage",
        href: "/category?brand=autodesk&category=navisworks-manage",
      },
    ],
  },
];

const AutodeskDropdown: React.FC<AutodeskDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { colors } = useAdminTheme();
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

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

  // Always position absolutely under the nav/menu
  return (
    //give mt as negative margin to align better with header
    <div
      className="absolute left-0 d rounded-xl shadow-2xl z-50 overflow-hidden border all-categories-dropdown"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
        minWidth: "900px",
        maxWidth: "1200px",
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <div className="p-6">
        {/* Categories grid - compact, header removed */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {autodeskCategories.map((category, index) => (
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
                {category.products.map((product, pIndex) => {
                  const isOpen = activeProduct === product.href;
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

                      {/* Sub-product popup */}
                      {isOpen && product.topProducts && (
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
              onNavigate("/autodesk");
              onClose();
            }}
            className="py-3 px-6 rounded-lg font-medium transition-all duration-200 text-lg"
            style={{
              backgroundColor: colors.text.primary,
              color: colors.text.inverse,
            }}
          >
            View All Autodesk Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutodeskDropdown;
