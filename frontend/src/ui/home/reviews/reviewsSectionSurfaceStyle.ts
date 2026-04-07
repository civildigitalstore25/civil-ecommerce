import type { CSSProperties } from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

export function reviewsSectionGradientStyle(colors: ThemeColors): CSSProperties {
  return {
    background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
    border: "none",
    boxShadow: "none",
    borderRadius: 0,
  };
}
