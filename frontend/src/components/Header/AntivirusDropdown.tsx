import React, { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface AntivirusSubProduct {
  name: string;
  href: string;
}

interface AntivirusProduct {
  name: string;
  href: string;
  topProducts?: AntivirusSubProduct[];
}

interface AntivirusCategory {
  name: string;
  products: AntivirusProduct[];
}

interface AntivirusDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const antivirusCategories: AntivirusCategory[] = [
  {
    name: "Home & Personal Security",
    products: [
      {
        name: "K7 Security",
        href: "/antivirus/k7-security",
        topProducts: [
          { name: "K7 Total Security", href: "/antivirus/k7-total-security" },
          {
            name: "K7 Internet Security",
            href: "/antivirus/k7-internet-security",
          },
          {
            name: "K7 Ultimate Security",
            href: "/antivirus/k7-ultimate-security",
          },
          {
            name: "K7 Antivirus Premium",
            href: "/antivirus/k7-antivirus-premium",
          },
        ],
      },
      {
        name: "Quick Heal",
        href: "/antivirus/quick-heal",
        topProducts: [
          {
            name: "Quick Heal Total Security",
            href: "/antivirus/quick-heal-total-security",
          },
          {
            name: "Quick Heal Internet Security",
            href: "/antivirus/quick-heal-internet-security",
          },
          {
            name: "Quick Heal Antivirus Pro",
            href: "/antivirus/quick-heal-antivirus-pro",
          },
        ],
      },
      {
        name: "Norton",
        href: "/antivirus/norton",
        topProducts: [
          { name: "Norton 360 Deluxe", href: "/antivirus/norton-360-deluxe" },
          {
            name: "Norton 360 Standard",
            href: "/antivirus/norton-360-standard",
          },
          {
            name: "Norton AntiVirus Plus",
            href: "/antivirus/norton-antivirus-plus",
          },
          { name: "Norton 360 Premium", href: "/antivirus/norton-360-premium" },
        ],
      },
    ],
  },
  {
    name: "Business & Enterprise",
    products: [
      {
        name: "McAfee",
        href: "/antivirus/mcafee",
        topProducts: [
          {
            name: "McAfee Total Protection",
            href: "/antivirus/mcafee-total-protection",
          },
          { name: "McAfee LiveSafe", href: "/antivirus/mcafee-livesafe" },
          {
            name: "McAfee AntiVirus Plus",
            href: "/antivirus/mcafee-antivirus-plus",
          },
          {
            name: "McAfee Small Business Security",
            href: "/antivirus/mcafee-business",
          },
        ],
      },
      {
        name: "ESET",
        href: "/antivirus/eset",
        topProducts: [
          { name: "ESET NOD32 Antivirus", href: "/antivirus/eset-nod32" },
          {
            name: "ESET Internet Security",
            href: "/antivirus/eset-internet-security",
          },
          {
            name: "ESET Smart Security Premium",
            href: "/antivirus/eset-smart-security",
          },
          { name: "ESET Endpoint Security", href: "/antivirus/eset-endpoint" },
        ],
      },
    ],
  },
  {
    name: "Advanced Protection",
    products: [
      {
        name: "Hyper Say",
        href: "/antivirus/hyper-say",
        topProducts: [
          {
            name: "Hyper Say Total Security",
            href: "/antivirus/hyper-say-total-security",
          },
          {
            name: "Hyper Say Internet Security",
            href: "/antivirus/hyper-say-internet-security",
          },
          {
            name: "Hyper Say Antivirus",
            href: "/antivirus/hyper-say-antivirus",
          },
        ],
      },
    ],
  },
];

const AntivirusDropdown: React.FC<AntivirusDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  buttonRef,
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { colors } = useAdminTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 mt-2 rounded-xl shadow-2xl z-50 overflow-hidden border"
      style={{
        minWidth: "1000px",
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 border-b"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.primary,
        }}
      >
        <h3
          className="text-xl font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          Antivirus & Security Solutions
        </h3>
        <p className="text-sm" style={{ color: colors.text.secondary }}>
          Protect your devices with trusted antivirus software
        </p>
      </div>

      {/* Categories Grid */}
      <div
        className="grid grid-cols-3 gap-0"
        style={{ backgroundColor: colors.background.primary }}
      >
        {antivirusCategories.map((category) => (
          <div
            key={category.name}
            className="p-5 border-r last:border-r-0"
            style={{
              borderColor: colors.border.primary,
              backgroundColor: colors.background.secondary,
            }}
          >
            <h4
              className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b"
              style={{
                color: colors.interactive.primary,
                borderColor: colors.border.secondary,
              }}
            >
              {category.name}
            </h4>
            <ul className="space-y-1">
              {category.products.map((product) => (
                <li key={product.name} className="group">
                  <button
                    onClick={() => handleNavigate(product.href)}
                    onMouseEnter={() => setHoveredProduct(product.name)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="w-full text-left px-3 py-2 rounded-lg transition-all duration-150 flex items-center justify-between"
                    style={{
                      backgroundColor:
                        hoveredProduct === product.name
                          ? colors.background.accent
                          : "transparent",
                    }}
                  >
                    <span
                      className="font-medium text-sm transition-colors"
                      style={{
                        color:
                          hoveredProduct === product.name
                            ? colors.interactive.primary
                            : colors.text.primary,
                      }}
                    >
                      {product.name}
                    </span>
                    {product.topProducts && (
                      <ChevronRight
                        className="w-4 h-4 transition-all"
                        style={{
                          color:
                            hoveredProduct === product.name
                              ? colors.interactive.primary
                              : colors.text.secondary,
                        }}
                      />
                    )}
                  </button>

                  {/* Sub-products */}
                  {product.topProducts && hoveredProduct === product.name && (
                    <ul
                      className="ml-4 mt-1 space-y-0.5 pl-3 border-l-2"
                      style={{ borderColor: colors.interactive.primary }}
                    >
                      {product.topProducts.map((subProduct) => (
                        <li key={subProduct.name}>
                          <button
                            onClick={() => handleNavigate(subProduct.href)}
                            className="w-full text-left px-2 py-1.5 text-xs rounded transition-colors"
                            style={{ color: colors.text.secondary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color =
                                colors.interactive.primary;
                              e.currentTarget.style.backgroundColor =
                                colors.background.accent;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color =
                                colors.text.secondary;
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                            }}
                          >
                            {subProduct.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 border-t"
        style={{
          borderColor: colors.border.primary,
          backgroundColor: colors.background.primary,
        }}
      >
        <button
          onClick={() => handleNavigate("/antivirus")}
          className="text-sm font-semibold transition-colors inline-flex items-center"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.interactive.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.interactive.primary;
          }}
        >
          View All Antivirus Products
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AntivirusDropdown;
