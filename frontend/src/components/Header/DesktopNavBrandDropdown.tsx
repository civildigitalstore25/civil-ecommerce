import React from "react";
import { ChevronDown } from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type DesktopNavBrandDropdownProps = {
  dropdownId: string;
  label: string;
  colors: ThemeColors;
  buttonRef: React.RefObject<HTMLDivElement | null>;
  activeDropdown: string | null;
  onSetDropdown: (id: string | null) => void;
  /** When true, panel only renders if `buttonRef.current` is set (matches legacy brand menus). */
  requireRefForPanel: boolean;
  children: React.ReactNode;
};

export function DesktopNavBrandDropdown({
  dropdownId,
  label,
  colors,
  buttonRef,
  activeDropdown,
  onSetDropdown,
  requireRefForPanel,
  children,
}: DesktopNavBrandDropdownProps) {
  const showPanel =
    activeDropdown === dropdownId &&
    (!requireRefForPanel || !!buttonRef.current);

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        onMouseEnter={() => onSetDropdown(dropdownId)}
        onMouseLeave={() => onSetDropdown(null)}
        className="inline-block"
      >
        <button
          type="button"
          className="flex items-center text-sm font-medium transition-all duration-200 whitespace-nowrap hover:opacity-80"
          style={{ color: colors.text.secondary }}
        >
          {label}
          <ChevronDown className="ml-0.5 w-3.5 h-3.5" />
        </button>
        {showPanel && (
          <div
            className="absolute left-0 z-50"
            onMouseEnter={() => onSetDropdown(dropdownId)}
            onMouseLeave={() => onSetDropdown(null)}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
