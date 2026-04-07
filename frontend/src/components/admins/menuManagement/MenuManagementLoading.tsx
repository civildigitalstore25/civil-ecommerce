import type { ThemeColors } from "../../../contexts/AdminThemeContext";

interface MenuManagementLoadingProps {
  colors: ThemeColors;
}

export function MenuManagementLoading({ colors }: MenuManagementLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: colors.interactive.primary }}
        />
        <p style={{ color: colors.text.secondary }}>Loading menus...</p>
      </div>
    </div>
  );
}
