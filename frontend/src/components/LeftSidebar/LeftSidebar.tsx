import React, { useState } from "react";
import { ChevronRight, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { leftSidebarNavigationCategories as navigationCategories } from "../../constants/leftSidebarNavigation";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
    null,
  );

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
    // Hide sidebar only in mobile view
    if (window.innerWidth < 1024) {
      onToggle();
    }
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
          rounded-r-xl
          shadow-2xl
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
          z-50
        `}
        style={{
          // Match the mega-menu dropdown left-panel feel
          backgroundColor: colors.background.secondary,
          borderRight: isOpen ? `1px solid ${colors.border.primary}` : "none",
          borderBottom: isOpen ? `1px solid ${colors.border.primary}` : "none",
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
              hover:scale-110
              transition-all duration-300
              z-[60]
            "
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text?.inverse ?? "#fff",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            title="Close sidebar"
          >
            <ChevronLeft className="w-6 h-6 font-bold" strokeWidth={3} />
          </button>
        )}

        {/* Mobile Header */}
        <div
          className="lg:hidden flex items-center justify-end p-4 rounded-tl-none rounded-tr-xl border-b"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        {/* Categories List - Only show when sidebar is open */}
        {isOpen && (
          <nav className="py-2">
            {navigationCategories.map((category) => (
              <div key={category.id} className="mb-0">
                {(() => {
                  const isExpanded = expandedCategories.includes(category.id);
                  const isHovered = hoveredCategoryId === category.id;
                  const isActive = isExpanded || isHovered;

                  return (
                    <button
                      onClick={() => {
                        if (category.subcategories && category.subcategories.length > 0) {
                          toggleCategory(category.id);
                        } else {
                          handleNavigation(category.href || "/");
                        }
                      }}
                      className="w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group border-l-4"
                      style={{
                        backgroundColor: isActive
                          ? (colors.background.accent ?? colors.background.secondary)
                          : "transparent",
                        borderLeftColor: isActive
                          ? colors.interactive.primary
                          : "transparent",
                      }}
                      onMouseEnter={() => setHoveredCategoryId(category.id)}
                      onMouseLeave={() => setHoveredCategoryId(null)}
                    >
                      <div>
                        <div
                          className="font-semibold text-base mb-0.5"
                          style={{
                            color: isActive ? colors.interactive.primary : colors.text.primary,
                          }}
                        >
                          {category.name}
                        </div>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <div className="text-xs" style={{ color: colors.text.secondary }}>
                            {category.subcategories.length} products
                          </div>
                        )}
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <span className="transition-transform duration-200">
                          {isExpanded ? (
                            <ChevronDown
                              className="w-5 h-5"
                              style={{
                                color: isActive
                                  ? colors.interactive.primary
                                  : colors.text.secondary,
                              }}
                            />
                          ) : (
                            <ChevronRight
                              className="w-5 h-5"
                              style={{
                                color: isActive
                                  ? colors.interactive.primary
                                  : colors.text.secondary,
                              }}
                            />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })()}

                {category.subcategories &&
                  category.subcategories.length > 0 &&
                  expandedCategories.includes(category.id) && (
                    <div className="px-2 pb-2">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() => handleNavigation(subcategory.href)}
                          className="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group mb-0.5"
                          style={{ color: colors.text.secondary }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.backgroundColor = colors.background.accent ?? colors.background.secondary;
                            el.style.color = colors.interactive.primary;
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement;
                            el.style.backgroundColor = "transparent";
                            el.style.color = colors.text.secondary;
                          }}
                        >
                          <span className="font-medium">{subcategory.name}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      <button
                        onClick={() => handleNavigation(category.href || "#")}
                        className="w-full mt-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors inline-flex items-center justify-center"
                        style={{ color: colors.interactive.primary }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            colors.background.accent ?? colors.background.secondary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        View all {category.name}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
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
