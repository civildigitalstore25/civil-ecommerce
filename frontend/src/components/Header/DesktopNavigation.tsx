import React from "react";
import AllCategoriesDropdown from "./AllCategoriesDropdown";
import AutodeskDropdown from "./AutodeskDropdown";
import MicrosoftDropdown from "./MicrosoftDropdown";
import AdobeDropdown from "./AdobeDropdown";
import AntivirusDropdown from "./AntivirusDropdown";
import { ChevronDown } from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import { useState, useRef } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface DesktopNavigationProps {
  onNavigate: (href: string) => void;
  autodeskButtonRef?: React.RefObject<HTMLButtonElement | null>;
  microsoftButtonRef?: React.RefObject<HTMLButtonElement | null>;
  adobeButtonRef?: React.RefObject<HTMLButtonElement | null>;
  antivirusButtonRef?: React.RefObject<HTMLButtonElement | null>;
  allCategoriesButtonRef?: React.RefObject<HTMLButtonElement | null>;
  hideHomeMenu?: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  onNavigate,
  autodeskButtonRef,
  microsoftButtonRef,
  adobeButtonRef,
  antivirusButtonRef,
  allCategoriesButtonRef,
  hideHomeMenu,
}) => {
  const { colors } = useAdminTheme();
  const [offersOpen, setOffersOpen] = useState(false);
  const offersButtonRef = useRef<HTMLButtonElement>(null);

  // Track which dropdown is hovered
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
      {/* Home Nav First (conditionally rendered) */}
      {!hideHomeMenu && (
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
      )}

      {/* All Categories Menu */}
      <div
        className="desktop-nav-dropdown-group"
        onMouseEnter={() => setHovered('allCategories')}
        onMouseLeave={() => setHovered(null)}
      >
        <button
          ref={allCategoriesButtonRef}
          className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
          style={{ color: colors.text.secondary }}
        >
          <span>All Categories</span>
          <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
        </button>
        {hovered === 'allCategories' && (
          <div className="desktop-nav-dropdown-panel">
            <AllCategoriesDropdown />
          </div>
        )}
      </div>

      {headerConfig.navigation
        .filter((item) => item.label !== "Home" && item.label !== "Super CRM")
        .map((item) => {
          // Special handling for AutoDesk menu item
          if (item.label === "AutoDesk") {
            return (
              <div
                className="desktop-nav-dropdown-group"
                key={item.href}
                onMouseEnter={() => setHovered('autodesk')}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  ref={autodeskButtonRef}
                  className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                  style={{ color: colors.text.secondary }}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
                </button>
                {hovered === 'autodesk' && autodeskButtonRef && (
                  <div className="desktop-nav-dropdown-panel">
                    <AutodeskDropdown
                      isOpen={true}
                      onClose={() => { }}
                      onNavigate={onNavigate}
                      buttonRef={autodeskButtonRef}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Special handling for Microsoft menu item
          if (item.label === "Microsoft") {
            return (
              <div
                className="desktop-nav-dropdown-group"
                key={item.href}
                onMouseEnter={() => setHovered('microsoft')}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  ref={microsoftButtonRef}
                  className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                  style={{ color: colors.text.secondary }}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
                </button>
                {hovered === 'microsoft' && microsoftButtonRef && (
                  <div className="desktop-nav-dropdown-panel">
                    <MicrosoftDropdown
                      isOpen={true}
                      onClose={() => { }}
                      onNavigate={onNavigate}
                      buttonRef={microsoftButtonRef}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Special handling for Adobe menu item
          if (item.label === "Adobe") {
            return (
              <div
                className="desktop-nav-dropdown-group"
                key={item.href}
                onMouseEnter={() => setHovered('adobe')}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  ref={adobeButtonRef}
                  className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                  style={{ color: colors.text.secondary }}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
                </button>
                {hovered === 'adobe' && adobeButtonRef && (
                  <div className="desktop-nav-dropdown-panel">
                    <AdobeDropdown
                      isOpen={true}
                      onClose={() => { }}
                      onNavigate={onNavigate}
                      buttonRef={adobeButtonRef}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Special handling for Antivirus menu item
          if (item.label === "Antivirus") {
            return (
              <div
                className="desktop-nav-dropdown-group"
                key={item.href}
                onMouseEnter={() => setHovered('antivirus')}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  ref={antivirusButtonRef}
                  className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                  style={{ color: colors.text.secondary }}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
                </button>
                {hovered === 'antivirus' && antivirusButtonRef && (
                  <div className="desktop-nav-dropdown-panel">
                    <AntivirusDropdown
                      isOpen={true}
                      onClose={() => { }}
                      onNavigate={onNavigate}
                      buttonRef={antivirusButtonRef}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Regular navigation items
          const isContact = item.label === "Contact";
          return (
            <React.Fragment key={item.href}>
              <button
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
              {/* Render Offers dropdown right after Contact */}
              {isContact && (
                <div className="relative" key="offers-dropdown">
                  <button
                    ref={offersButtonRef}
                    onClick={() => setOffersOpen((v) => !v)}
                    className="flex items-center space-x-1 font-medium hover:opacity-80 transition-all duration-200 whitespace-nowrap"
                    style={{ color: colors.text.secondary }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = colors.interactive.primary;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = colors.text.secondary;
                    }}
                    type="button"
                  >
                    <span>Offers</span>
                    <ChevronDown className="w-4 h-4" style={{ display: "inline-block" }} />
                  </button>
                  {offersOpen && (
                    <div
                      className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg z-50 border"
                      style={{ background: colors.background.primary, borderColor: colors.border.primary }}
                      onMouseLeave={() => setOffersOpen(false)}
                    >
                      {headerConfig.offers.map((offer) => (
                        <button
                          key={offer.href}
                          onClick={() => { setOffersOpen(false); onNavigate(offer.href); }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          style={{ color: colors.text.primary }}
                          type="button"
                        >
                          {offer.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
    </nav>
  );
};

export default DesktopNavigation;
