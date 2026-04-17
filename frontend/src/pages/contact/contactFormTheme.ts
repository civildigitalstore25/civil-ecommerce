import type { ThemeColors, ThemeMode } from "../../contexts/AdminThemeContext";

export function contactFormSectionTitleColor(theme: ThemeMode): string {
  return theme === "light" ? "#0A2A6B" : "#fff";
}

export function contactFormLabelColor(
  colors: ThemeColors,
  theme: ThemeMode,
): string {
  return theme === "light" ? colors.text.primary : colors.text.accent;
}
