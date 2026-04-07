import React, { useState, useRef } from "react";
import AllCategoriesDropdown from "./AllCategoriesDropdown";
import AutodeskDropdown from "./AutodeskDropdown";
import MicrosoftDropdown from "./MicrosoftDropdown";
import AdobeDropdown from "./AdobeDropdown";
import AntivirusDropdown from "./AntivirusDropdown";
import OffersDropdown from "./OffersDropdown";
import { headerConfig } from "./HeaderConfig";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import ProductSearchBar from "./ProductSearchBar";
import { DesktopNavBrandDropdown } from "./DesktopNavBrandDropdown";

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

  const handleNavigate = (href: string) => {
    onNavigate(href);
    setActiveDropdown(null);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4 mr-2">
      <DesktopNavBrandDropdown
        dropdownId="categories"
        label="All Categories"
        colors={colors}
        buttonRef={allCategoriesButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={false}
      >
        <AllCategoriesDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={allCategoriesButtonRef}
        />
      </DesktopNavBrandDropdown>

      <DesktopNavBrandDropdown
        dropdownId="autodesk"
        label="Autodesk"
        colors={colors}
        buttonRef={autodeskButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={true}
      >
        <AutodeskDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={autodeskButtonRef}
        />
      </DesktopNavBrandDropdown>

      <DesktopNavBrandDropdown
        dropdownId="adobe"
        label="Adobe"
        colors={colors}
        buttonRef={adobeButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={true}
      >
        <AdobeDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={adobeButtonRef}
        />
      </DesktopNavBrandDropdown>

      <DesktopNavBrandDropdown
        dropdownId="microsoft"
        label="Microsoft"
        colors={colors}
        buttonRef={microsoftButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={true}
      >
        <MicrosoftDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={microsoftButtonRef}
        />
      </DesktopNavBrandDropdown>

      <DesktopNavBrandDropdown
        dropdownId="antivirus"
        label="Antivirus"
        colors={colors}
        buttonRef={antivirusButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={true}
      >
        <AntivirusDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={antivirusButtonRef}
        />
      </DesktopNavBrandDropdown>

      <DesktopNavBrandDropdown
        dropdownId="offers"
        label="Offers"
        colors={colors}
        buttonRef={offersButtonRef}
        activeDropdown={activeDropdown}
        onSetDropdown={setActiveDropdown}
        requireRefForPanel={true}
      >
        <OffersDropdown
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onNavigate={handleNavigate}
          buttonRef={offersButtonRef}
          offers={offers}
        />
      </DesktopNavBrandDropdown>

      <button
        type="button"
        onClick={() => onNavigate("/blog")}
        className="text-sm font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        Blog
      </button>
      <button
        type="button"
        onClick={() => onNavigate("/about-us")}
        className="text-sm font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        About Us
      </button>
      <button
        type="button"
        onClick={() => onNavigate("/contact")}
        className="text-sm font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        Contact Us
      </button>
      <ProductSearchBar className="hidden lg:block w-36 xl:w-40" />
    </nav>
  );
};

export default DesktopNavigation;
