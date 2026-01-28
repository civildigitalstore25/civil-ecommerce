import React, { useState, useRef } from "react";
import AllCategoriesDropdown from "./AllCategoriesDropdown";
import AutodeskDropdown from "./AutodeskDropdown";
import MicrosoftDropdown from "./MicrosoftDropdown";
import AdobeDropdown from "./AdobeDropdown";
import AntivirusDropdown from "./AntivirusDropdown";
import OffersDropdown from "./OffersDropdown";
import { ChevronDown } from "lucide-react";
import { headerConfig } from "./HeaderConfig";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface DesktopNavigationProps {
  onNavigate: (href: string) => void;
  autodeskButtonRef?: React.RefObject<HTMLDivElement | null>;
  microsoftButtonRef?: React.RefObject<HTMLDivElement | null>;
  adobeButtonRef?: React.RefObject<HTMLDivElement | null>;
  antivirusButtonRef?: React.RefObject<HTMLDivElement | null>;
  allCategoriesButtonRef?: React.RefObject<HTMLDivElement | null>;
  hideHomeMenu?: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  onNavigate,
  autodeskButtonRef = useRef<HTMLDivElement>(null),
  microsoftButtonRef = useRef<HTMLDivElement>(null),
  adobeButtonRef = useRef<HTMLDivElement>(null),
  antivirusButtonRef = useRef<HTMLDivElement>(null),
  allCategoriesButtonRef = useRef<HTMLDivElement>(null),
}) => {
  const { colors } = useAdminTheme();
  const offers = headerConfig.offers;
  const offersButtonRef = useRef<HTMLDivElement>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (name: string | null) => {
    setActiveDropdown(name);
  };

  const handleNavigate = (href: string) => {
    onNavigate(href);
    setActiveDropdown(null);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
      {/* All Categories Dropdown */}
      <div className="relative">
        <div
          ref={allCategoriesButtonRef}
          onMouseEnter={() => handleDropdownToggle('categories')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            All Categories
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'categories' && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('categories')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <AllCategoriesDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
                buttonRef={allCategoriesButtonRef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Autodesk Dropdown */}
      <div className="relative">
        <div
          ref={autodeskButtonRef}
          onMouseEnter={() => handleDropdownToggle('autodesk')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            Autodesk
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'autodesk' && autodeskButtonRef.current && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('autodesk')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <AutodeskDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
                buttonRef={autodeskButtonRef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Adobe Dropdown */}
      <div className="relative">
        <div
          ref={adobeButtonRef}
          onMouseEnter={() => handleDropdownToggle('adobe')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            Adobe
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'adobe' && adobeButtonRef.current && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('adobe')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <AdobeDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
              />
            </div>
          )}
        </div>
      </div>

      {/* Microsoft Dropdown */}
      <div className="relative">
        <div
          ref={microsoftButtonRef}
          onMouseEnter={() => handleDropdownToggle('microsoft')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            Microsoft
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'microsoft' && microsoftButtonRef.current && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('microsoft')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <MicrosoftDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
                buttonRef={microsoftButtonRef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Antivirus Dropdown */}
      <div className="relative">
        <div
          ref={antivirusButtonRef}
          onMouseEnter={() => handleDropdownToggle('antivirus')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            Antivirus
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'antivirus' && antivirusButtonRef.current && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('antivirus')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <AntivirusDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
                buttonRef={antivirusButtonRef}
              />
            </div>
          )}
        </div>
      </div>

      {/* Offers Dropdown */}
      <div className="relative">
        <div
          ref={offersButtonRef}
          onMouseEnter={() => handleDropdownToggle('offers')}
          onMouseLeave={() => handleDropdownToggle(null)}
          className="inline-block"
        >
          <button
            className="flex items-center font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
            style={{ color: colors.text.secondary }}
          >
            Offers
            <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          {activeDropdown === 'offers' && offersButtonRef.current && (
            <div
              className="absolute left-0 z-50"
              onMouseEnter={() => handleDropdownToggle('offers')}
              onMouseLeave={() => handleDropdownToggle(null)}
            >
              <OffersDropdown
                isOpen={true}
                onClose={() => setActiveDropdown(null)}
                onNavigate={handleNavigate}
                buttonRef={offersButtonRef}
                offers={offers}
              />
            </div>
          )}
        </div>
      </div>

      {/* Other navigation items */}
      <button
        onClick={() => onNavigate("/about-us")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        About Us
      </button>
      <button
        onClick={() => onNavigate("/contact")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        Contact Us
      </button>
    </nav>
  );
};

export default DesktopNavigation;
