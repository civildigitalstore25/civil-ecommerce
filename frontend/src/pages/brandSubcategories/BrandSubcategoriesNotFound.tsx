import { Package } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

export function BrandSubcategoriesNotFound({
  colors,
  navigate,
}: {
  colors: ThemeColors;
  navigate: NavigateFunction;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center pt-20 px-4"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Package
        className="w-24 h-24 mb-4"
        style={{ color: colors.text.secondary }}
      />
      <h3
        className="text-2xl font-semibold mb-2 text-center"
        style={{ color: colors.text.primary }}
      >
        Brand Not Found
      </h3>
      <p
        className="text-lg mb-6 text-center"
        style={{ color: colors.text.secondary }}
      >
        We couldn&apos;t find this brand.
      </p>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-lg transition-colors"
        style={{
          backgroundColor: colors.interactive.primary,
          color: colors.text.inverse,
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
