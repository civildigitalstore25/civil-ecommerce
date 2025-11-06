import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import {
  Ruler,
  FileText,
  Palette,
  Shield,
} from "lucide-react";

// Category items matching the desktop header
const categories = [
  {
    icon: Ruler,
    label: "AutoDesk",
    href: "/autodesk",
    color: "#f59e0b", // amber
  },
  {
    icon: FileText,
    label: "Microsoft",
    href: "/microsoft",
    color: "#3b82f6", // blue
  },
  {
    icon: Palette,
    label: "Adobe",
    href: "/adobe",
    color: "#ec4899", // pink
  },
  {
    icon: Shield,
    label: "Antivirus",
    href: "/antivirus",
    color: "#10b981", // green
  },
];

const MobileShopByCategory: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  const handleCategoryClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2
          className="text-lg font-bold mb-1"
          style={{ color: colors.text.primary }}
        >
          Shop by Category
        </h2>
        <p
          className="text-xs"
          style={{ color: colors.text.secondary }}
        >
          Find the perfect software for your needs
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.label}
              onClick={() => handleCategoryClick(category.href)}
              className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: colors.background.secondary }}
            >
              {/* Icon Container */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <IconComponent
                  className="w-6 h-6"
                  style={{ color: category.color }}
                />
              </div>
              
              {/* Label */}
              <span
                className="text-[10px] font-medium text-center leading-tight"
                style={{ color: colors.text.primary }}
              >
                {category.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileShopByCategory;
