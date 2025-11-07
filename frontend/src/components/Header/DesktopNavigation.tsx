import React from "react";
import { ChevronDown } from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface DesktopNavigationProps {
  onNavigate: (href: string) => void;
  autodeskButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onAutodeskClick?: () => void;
  microsoftButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onMicrosoftClick?: () => void;
  adobeButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onAdobeClick?: () => void;
  antivirusButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onAntivirusClick?: () => void;
  allCategoriesButtonRef?: React.RefObject<HTMLButtonElement | null>;
  onAllCategoriesClick?: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  onNavigate,
  autodeskButtonRef,
  onAutodeskClick,
  microsoftButtonRef,
  onMicrosoftClick,
  adobeButtonRef,
  onAdobeClick,
  antivirusButtonRef,
  onAntivirusClick,
  allCategoriesButtonRef,
  onAllCategoriesClick,
}) => {
  const { colors } = useAdminTheme();

  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
      {/* Home Nav First */}
      <button
        key="home-nav"
        onClick={() => onNavigate("/")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color =
            colors.interactive.primary;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
        }}
      >
        Home
      </button>

      {/* All Categories Menu */}
      <button
        ref={allCategoriesButtonRef}
        onClick={(e) => {
          e.preventDefault();
          if (onAllCategoriesClick) {
            onAllCategoriesClick();
          }
        }}
        className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
        style={{ color: colors.text.secondary }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color =
            colors.interactive.primary;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
        }}
      >
        <span>All Categories</span>
        <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
      </button>

      {headerConfig.navigation
        .filter((item) => item.label !== "Home")
        .map((item) => {
          // Special handling for AutoDesk menu item
          if (item.label === "AutoDesk") {
            return (
              <button
                key={item.href}
                ref={autodeskButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("AutoDesk button clicked");
                  if (onAutodeskClick) {
                    onAutodeskClick();
                  }
                }}
                className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                }}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className="w-4 h-4"
                  style={{ display: "inline-block" }}
                />
              </button>
            );
          }

          // Special handling for Microsoft menu item
          if (item.label === "Microsoft") {
            return (
              <button
                key={item.href}
                ref={microsoftButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Microsoft button clicked");
                  if (onMicrosoftClick) {
                    onMicrosoftClick();
                  }
                }}
                className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                }}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className="w-4 h-4"
                  style={{ display: "inline-block" }}
                />
              </button>
            );
          }

          // Special handling for Adobe menu item
          if (item.label === "Adobe") {
            return (
              <button
                key={item.href}
                ref={adobeButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Adobe button clicked");
                  if (onAdobeClick) {
                    onAdobeClick();
                  }
                }}
                className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                }}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className="w-4 h-4"
                  style={{ display: "inline-block" }}
                />
              </button>
            );
          }

          // Special handling for Antivirus menu item
          if (item.label === "Antivirus") {
            return (
              <button
                key={item.href}
                ref={antivirusButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Antivirus button clicked");
                  if (onAntivirusClick) {
                    onAntivirusClick();
                  }
                }}
                className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.interactive.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    colors.text.secondary;
                }}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className="w-4 h-4"
                  style={{ display: "inline-block" }}
                />
              </button>
            );
          }

          // Regular navigation items
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
              style={{ color: colors.text.secondary }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.interactive.primary;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  colors.text.secondary;
              }}
            >
              {item.label}
            </button>
          );
        })}
    </nav>
  );
};

export default DesktopNavigation;
