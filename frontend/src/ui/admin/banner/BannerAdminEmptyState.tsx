import { Plus } from "lucide-react";
import type { ThemeColors, ThemeMode } from "../../../contexts/AdminThemeContext";

interface BannerAdminEmptyStateProps {
  colors: ThemeColors;
  theme: ThemeMode;
  onCreate: () => void;
}

export function BannerAdminEmptyState({
  colors,
  theme,
  onCreate,
}: BannerAdminEmptyStateProps) {
  const gradient =
    theme === "dark"
      ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
      : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-lg border-2 w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-28 md:min-h-32 lg:min-h-36"
        style={{
          borderColor: colors.interactive.primary,
          color: colors.text.secondary,
          backgroundColor: colors.background.secondary,
        }}
      >
        <div
          className="mb-3 md:mb-4 p-3 md:p-4 rounded-full"
          style={{
            background: gradient,
            color: colors.text.inverse,
            border: "none",
          }}
        >
          <Plus size={24} className="md:w-8 md:h-8" />
        </div>
        <h2
          className="text-lg sm:text-xl font-semibold mb-2"
          style={{ color: colors.text.primary }}
        >
          No banners found
        </h2>
        <p
          className="text-sm sm:text-base mb-4 max-w-md"
          style={{ color: colors.text.secondary }}
        >
          Create your first banner to promote offers and updates to your
          customers.
        </p>
        <button
          type="button"
          onClick={onCreate}
          style={{
            background: gradient,
            color: colors.text.inverse,
            border: "none",
          }}
          className="rounded-lg px-4 py-2 font-medium hover:shadow-md transition border-2"
        >
          Create Your First Banner
        </button>
      </div>
    </div>
  );
}
