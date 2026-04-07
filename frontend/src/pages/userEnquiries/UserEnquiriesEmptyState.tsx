import { Mail } from "lucide-react";
import type { NavigateFunction } from "react-router-dom";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type UserEnquiriesEmptyStateProps = {
  colors: ThemeColors;
  navigate: NavigateFunction;
};

export function UserEnquiriesEmptyState({
  colors,
  navigate,
}: UserEnquiriesEmptyStateProps) {
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <Mail
        className="w-16 h-16 mx-auto mb-4 opacity-50"
        style={{ color: colors.text.secondary }}
      />
      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: colors.text.primary }}
      >
        No enquiries yet
      </h3>
      <p style={{ color: colors.text.secondary }} className="mb-6">
        You haven&apos;t submitted any enquiries yet
      </p>
      <button
        type="button"
        onClick={() => navigate("/products")}
        className="px-6 py-3 rounded-lg font-medium transition-colors"
        style={{
          backgroundColor: colors.interactive.primary,
          color: "#ffffff",
        }}
      >
        Browse Products
      </button>
    </div>
  );
}
