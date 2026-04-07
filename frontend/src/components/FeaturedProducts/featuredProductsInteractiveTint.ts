import type { ThemeColors } from "../../contexts/AdminThemeContext";

/** Badge background tint that works when primary is a gradient string. */
export function getFeaturedProductsInteractiveTint(colors: ThemeColors): string {
  const primary = colors.interactive.primary;
  if (
    primary &&
    typeof primary === "string" &&
    primary.startsWith("linear-gradient")
  ) {
    return `${colors.interactive.secondary}20`;
  }
  return `${primary}20`;
}

export function getFeaturedProductsBadgeTextColor(colors: ThemeColors): string {
  const primary = colors.interactive.primary;
  if (
    typeof primary === "string" &&
    primary.startsWith("linear-gradient")
  ) {
    return colors.interactive.secondary;
  }
  return primary;
}
