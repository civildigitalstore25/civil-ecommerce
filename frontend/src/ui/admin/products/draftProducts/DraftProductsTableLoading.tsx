import type { ThemeColors } from "../../../../contexts/AdminThemeContext";

export function DraftProductsTableLoading({ colors }: { colors: ThemeColors }) {
  return (
    <div className="p-8 text-center">
      <div
        className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
        style={{ borderColor: colors.interactive.primary }}
      />
      <p className="mt-2" style={{ color: colors.text.secondary }}>
        Loading draft products...
      </p>
    </div>
  );
}
