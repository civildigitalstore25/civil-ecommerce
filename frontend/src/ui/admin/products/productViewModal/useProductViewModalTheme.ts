import { useMemo } from "react";
import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

/** Shared admin theme tokens for ProductViewModal surfaces and typography. */
export function useProductViewModalTheme() {
  const { colors, theme } = useAdminTheme();

  return useMemo(
    () => ({
      colors,
      theme,
      isDark: theme === "dark",
      surface: { backgroundColor: colors.background.secondary },
      surfaceMuted: { backgroundColor: colors.background.accent },
      borderColor: colors.border.primary,
      heading: { color: colors.text.primary },
      body: { color: colors.text.primary },
      muted: { color: colors.text.secondary },
      accentIcon: { color: colors.text.accent },
      thumbSelected: { borderColor: colors.text.accent },
      thumbDefault: { borderColor: colors.border.primary },
      metadataCode: {
        backgroundColor: theme === "dark" ? colors.background.primary : "#f3f4f6",
        color: colors.text.primary,
      },
      categoryPill: {
        backgroundColor:
          theme === "dark" ? "rgba(0, 104, 255, 0.18)" : "rgba(0, 104, 255, 0.12)",
        color: colors.text.primary,
      },
    }),
    [colors, theme],
  );
}
