import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { getAllMenus, type IMenu } from "../../api/menuApi";

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [menus, setMenus] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await getAllMenus(false); // Only active menus
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNavigation = (slug: string) => {
    navigate(`/brand/${slug}`);
  };

  if (loading) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
        <aside
          className={`
            fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-[calc(100vh-80px)]
            transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-0 lg:w-80" : "-translate-x-full lg:translate-x-0 lg:w-0"}
            w-80
            overflow-y-auto
            shadow-lg
            z-50
          `}
          style={{
            backgroundColor: colors.background.primary,
            borderRight: isOpen ? `1px solid ${colors.border.primary}` : 'none',
          }}
        >
          {/* Desktop Toggle Button - Positioned at bottom center */}
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
                hover:shadow-2xl
                hover:scale-110
                transition-all duration-300
                z-[60]
                bg-blue-600 hover:bg-blue-700
              "
            >
              <ChevronLeft className="w-6 h-6 text-white font-bold" strokeWidth={3} />
            </button>
          )}

          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: colors.interactive.primary }}
              ></div>
              <p style={{ color: colors.text.secondary }}>Loading menus...</p>
            </div>
          </div>
        </aside>
      </>
    );
  }

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
          shadow-lg
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
          z-50
        `}
        style={{
          backgroundColor: colors.background.primary,
          borderRight: isOpen ? `1px solid ${colors.border.primary}` : 'none',
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
              hover:shadow-2xl
              hover:scale-110
              transition-all duration-300
              z-[60]
              bg-blue-600 hover:bg-blue-700
            "
            title="Close sidebar"
          >
            <ChevronLeft className="w-6 h-6 text-white font-bold" strokeWidth={3} />
          </button>
        )}

        {/* Mobile Header */}
        <div
          className="lg:hidden flex items-center justify-end p-4 border-b"
          style={{
            borderColor: colors.border.primary,
            backgroundColor: colors.background.secondary,
          }}
        >
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
            style={{ backgroundColor: colors.background.primary }}
          >
            <X className="w-5 h-5" style={{ color: colors.text.primary }} />
          </button>
        </div>



        {/* Categories List - Only show when sidebar is open */}
        {isOpen && (
          <nav className="p-2">
            {menus.length === 0 ? (
              <div className="text-center py-8" style={{ color: colors.text.secondary }}>
                <p>No categories available</p>
              </div>
            ) : (
              menus.map((menu) => (
              <div key={menu._id} className="mb-1">
                {/* Category Header */}
                <button
                  onClick={() => menu.children && menu.children.length > 0 ? toggleCategory(menu._id) : handleNavigation(menu.slug)}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:shadow-md group"
                  style={{
                    backgroundColor: expandedCategories.includes(menu._id)
                      ? colors.background.secondary
                      : "transparent",
                    color: colors.text.primary,
                  }}
                >
                  <span className="font-medium text-left group-hover:translate-x-1 transition-transform duration-200">
                    {menu.name}
                  </span>
                  {menu.children && menu.children.length > 0 && (
                    <span className="transition-transform duration-200">
                      {expandedCategories.includes(menu._id) ? (
                        <ChevronDown
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      ) : (
                        <ChevronRight
                          className="w-4 h-4"
                          style={{ color: colors.text.secondary }}
                        />
                      )}
                    </span>
                  )}
                </button>

                {/* SubCategories */}
                {menu.children &&
                  menu.children.length > 0 &&
                  expandedCategories.includes(menu._id) && (
                    <div
                      className="ml-4 mt-1 mb-2 border-l-2 pl-2 animate-slideDown"
                      style={{ borderColor: colors.border.primary }}
                    >
                      {menu.children.map((subMenu) => (
                        <button
                          key={subMenu._id}
                          onClick={() => handleNavigation(subMenu.slug)}
                          className="w-full text-left p-2 pl-3 rounded-md transition-all duration-200 hover:shadow-sm hover:pl-4 mb-1 group"
                          style={{ color: colors.text.secondary }}
                        >
                          <span className="group-hover:font-medium transition-all duration-200">
                            {subMenu.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))
            )}
          </nav>
        )}
      </aside>
    </>
  );
};

export default LeftSidebar;
