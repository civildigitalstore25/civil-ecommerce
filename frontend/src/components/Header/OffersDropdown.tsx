import React, { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface OfferItem {
  label: string;
  href: string;
}

interface OffersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  buttonRef: React.RefObject<HTMLElement | null>;
  offers: OfferItem[];
}

const OffersDropdown: React.FC<OffersDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  buttonRef,
  offers,
}) => {
  const { colors } = useAdminTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const handleOfferClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute left-0 mt-[-1px] rounded-xl shadow-2xl z-50 overflow-hidden border min-w-[200px]"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <div className="py-1">
        {offers.map((offer, index) => (
          <button
            key={index}
            onClick={(e) => handleOfferClick(e, offer.href)}
            className="w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-opacity-10 hover:bg-gray-500 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {offer.label}
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default OffersDropdown;
