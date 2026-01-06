import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  useCurrency,
  currencies,
  type CurrencyType,
} from "../../contexts/CurrencyContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface CurrencyDropdownProps {
  className?: string;
  compact?: boolean; // For mobile or smaller displays
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  className = "",
  compact = false,
}) => {
  const { selectedCurrency, setCurrency, getCurrencyInfo } = useCurrency();
  const { colors } = useAdminTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentCurrency = getCurrencyInfo();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCurrencyChange = (currency: CurrencyType) => {
    setCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200
          hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50
          ${compact ? "text-xs" : "text-sm"}
        `}
        style={{
          backgroundColor: colors.background.secondary,
          color: colors.text.primary,
          border: 'none',
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.interactive.primary}40`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        // Remove background color change on hover
        onMouseEnter={undefined}
        onMouseLeave={undefined}
      >
        <span className={compact ? "text-base" : "text-lg"}>
          {currentCurrency.symbol}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full mt-2 right-0 z-50 min-w-[200px] rounded-lg shadow-lg border overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.secondary,
          }}
        >
          {Object.values(currencies).map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 transition-colors duration-150
                hover:bg-opacity-80 text-left
                ${selectedCurrency === currency.code ? "font-medium" : ""}
              `}
              style={{
                backgroundColor:
                  selectedCurrency === currency.code
                    ? colors.interactive.primary + "20"
                    : "transparent",
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => {
                if (selectedCurrency !== currency.code) {
                  e.currentTarget.style.backgroundColor = colors.background.accent;
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCurrency !== currency.code) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
            >
              <span className="text-base" style={{ color: 'inherit', filter: 'none' }}>{currency.flag}</span>
              <span className="ml-2 text-sm">{currency.name}</span>
              {selectedCurrency === currency.code && (
                <Check
                  className="w-4 h-4"
                  style={{ color: colors.interactive.primary }}
                />
              )}
            </button>
          ))}

          {/* Exchange Rate Info removed as per request */}
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
