import React from "react";
// import AllCategoriesDropdown from "./AllCategoriesDropdown";
// import AutodeskDropdown from "./AutodeskDropdown";
// import MicrosoftDropdown from "./MicrosoftDropdown";
// import AdobeDropdown from "./AdobeDropdown";
// import AntivirusDropdown from "./AntivirusDropdown";
// import { ChevronDown } from "lucide-react";
// import { headerConfig } from "./HeaderConfig";
// import { useState, useRef } from "react";
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
  // autodeskButtonRef,
  // microsoftButtonRef,
  // adobeButtonRef,
  // antivirusButtonRef,
  // allCategoriesButtonRef,
  // hideHomeMenu,
}) => {
  const { colors } = useAdminTheme();

  // --- OLD MENU COMMENTED OUT ---
  /*
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
      ...existing code for all categories, brands, offers, etc...
    </nav>
  */

  // --- NEW SIMPLE MENU ---
  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 mr-4">
      <button
        onClick={() => onNavigate("/")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        Home
      </button>
      <button
        onClick={() => onNavigate("/about-us")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        About Us
      </button>
      <button
        onClick={() => onNavigate("/category?brand=ebook")}
        className="font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
        style={{ color: colors.text.secondary }}
      >
        Ebook
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
