import React from "react";
import { User, Menu, Package, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface MobileBottomNavProps {
  onMenuToggle: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useAdminTheme();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => handleNavigate("/profile"),
      path: "/profile",
    },
    {
      icon: Menu,
      label: "Menu",
      onClick: onMenuToggle,
      path: null, // Special item - doesn't have a route
    },
    {
      icon: Package,
      label: "Orders",
      onClick: () => handleNavigate("/my-orders"),
      path: "/my-orders",
    },
    {
      icon: MessageSquare,
      label: "Enquiries",
      onClick: () => handleNavigate("/my-enquiries"),
      path: "/my-enquiries",
    },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <nav
      className="lg:hidden mobile-nav-fixed border-t shadow-lg"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 active:scale-95"
              style={{
                color: active ? colors.interactive.primary : colors.text.secondary,
              }}
            >
              <Icon
                className={`w-6 h-6 transition-all duration-200 ${
                  active ? "scale-110" : ""
                }`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium ${
                  active ? "font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
