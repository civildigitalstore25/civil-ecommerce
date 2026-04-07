import React from "react";
import * as LucideIcons from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  categoryTitle: string;
  breadcrumbProductName: string;
  showEditButton: boolean;
  onEditClick: () => void;
  onBack: () => void;
};

export const ProductDetailTopBar: React.FC<Props> = ({
  colors,
  categoryTitle,
  breadcrumbProductName,
  showEditButton,
  onEditClick,
  onBack,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-2 lg:py-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div
          className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm overflow-x-auto"
          style={{ color: colors.text.secondary }}
        >
          <span>Home</span>
          <span>{">"}</span>
          <span>{categoryTitle}</span>
          <span>{">"}</span>
          <span style={{ color: colors.interactive.primary }}>
            <span className="hidden md:inline">{breadcrumbProductName}</span>
            <span className="inline md:hidden">
              {breadcrumbProductName.length > 15
                ? `${breadcrumbProductName.substring(0, 15).trim()}...`
                : breadcrumbProductName}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {showEditButton && (
            <button
              type="button"
              onClick={onEditClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                color: "#fff",
                backgroundColor: "#FF6B35",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FF8C5A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6B35";
              }}
              title="Edit Product"
            >
              <LucideIcons.Edit size={18} />
              <span className="text-sm font-medium">Edit</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.background.secondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.accent;
              e.currentTarget.style.color = colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.background.secondary;
              e.currentTarget.style.color = colors.text.secondary;
            }}
          >
            <LucideIcons.ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
