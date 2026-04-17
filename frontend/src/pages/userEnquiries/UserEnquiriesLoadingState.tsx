import type { ThemeColors } from "../../contexts/AdminThemeContext";

export function UserEnquiriesLoadingState({ colors }: { colors: ThemeColors }) {
  return (
    <div
      className="flex items-center justify-center py-20"
      style={{ color: colors.text.secondary }}
    >
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
          style={{ borderColor: colors.interactive.primary }}
        />
        <p>Loading enquiries...</p>
      </div>
    </div>
  );
}
