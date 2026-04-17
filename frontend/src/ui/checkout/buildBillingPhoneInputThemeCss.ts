import type { ThemeColors } from "../../contexts/AdminThemeContext";

/** Scoped CSS overrides for `react-phone-input-2` to match checkout theme tokens. */
export function buildBillingPhoneInputThemeCss(colors: ThemeColors): string {
  const border = colors.border?.primary ?? "#e5e7eb";
  const bgSecondaryHover =
    colors.background.secondary ?? "rgba(0,0,0,0.1)";
  const bgSecondaryMuted =
    colors.background.secondary ?? "rgba(0,0,0,0.05)";
  const textSecondary = colors.text.secondary ?? "#9ca3af";
  const primary = colors.interactive.primary;

  return `
    .phone-input-wrapper .react-tel-input .form-control {
      width: 100% !important;
      padding-left: 60px !important;
      padding-right: 16px !important;
      padding-top: 10px !important;
      padding-bottom: 10px !important;
      border-radius: 0.5rem !important;
      background-color: ${colors.background.primary} !important;
      border: 1px solid ${border} !important;
      color: ${colors.text.primary} !important;
      font-size: 0.875rem !important;
      outline: none !important;
      transition: all 0.2s !important;
    }
    .phone-input-wrapper .react-tel-input .form-control:focus {
      border-color: ${primary} !important;
      box-shadow: 0 0 0 2px ${primary}33 !important;
    }
    .phone-input-wrapper .react-tel-input .flag-dropdown {
      background-color: ${colors.background.primary} !important;
      border: none !important;
      border-radius: 0.5rem !important;
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    .phone-input-wrapper .react-tel-input .flag-dropdown:hover,
    .phone-input-wrapper .react-tel-input .flag-dropdown.open {
      background-color: ${colors.background.primary} !important;
    }
    .phone-input-wrapper .react-tel-input .selected-flag {
      background-color: transparent !important;
      padding: 0 8px !important;
    }
    .phone-input-wrapper .react-tel-input .selected-flag:hover,
    .phone-input-wrapper .react-tel-input .selected-flag.open {
      background-color: ${bgSecondaryHover} !important;
    }
    .phone-input-wrapper .react-tel-input .country-list {
      background-color: ${colors.background.primary} !important;
      border: 1px solid ${border} !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
      margin-top: 4px !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .country {
      background-color: ${colors.background.primary} !important;
      color: ${colors.text.primary} !important;
      padding: 8px 12px !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .country:hover,
    .phone-input-wrapper .react-tel-input .country-list .country.highlight {
      background-color: ${bgSecondaryHover} !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .country.preferred {
      background-color: ${bgSecondaryMuted} !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .search {
      background-color: ${colors.background.primary} !important;
      padding: 8px !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 1 !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .search-box {
      width: 100% !important;
      padding: 8px 12px !important;
      border-radius: 0.375rem !important;
      background-color: ${bgSecondaryHover} !important;
      border: 1px solid ${border} !important;
      color: ${colors.text.primary} !important;
      font-size: 0.875rem !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .search-box::placeholder {
      color: ${textSecondary} !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .search-box:focus {
      outline: none !important;
      border-color: ${primary} !important;
      box-shadow: 0 0 0 2px ${primary}33 !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .divider {
      border-bottom: 1px solid ${border} !important;
    }
    .phone-input-wrapper .react-tel-input .country-list .country-name,
    .phone-input-wrapper .react-tel-input .country-list .dial-code {
      color: ${colors.text.primary} !important;
    }
  `;
}
