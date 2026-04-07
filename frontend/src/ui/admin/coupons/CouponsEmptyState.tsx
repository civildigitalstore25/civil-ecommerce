import React from "react";
import { Plus } from "lucide-react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  theme: "light" | "dark";
  onCreate: () => void;
};

const CouponsEmptyState: React.FC<Props> = ({ colors, theme, onCreate }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div
      className="flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-lg border-2 w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-28 md:min-h-32 lg:min-h-36"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: colors.interactive.primary,
      }}
    >
      <div
        className="mb-3 md:mb-4 p-3 md:p-4 rounded-full"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
              : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
          color: colors.text.inverse,
          border: "none",
        }}
      >
        <Plus
          size={24}
          className="md:w-8 md:h-8"
          style={{ color: colors.text.secondary }}
        />
      </div>
      <p
        className="text-base md:text-lg lg:text-xl font-semibold mb-2 md:mb-3 text-center"
        style={{ color: colors.text.primary }}
      >
        No coupons found
      </p>
      <p
        className="text-xs md:text-sm lg:text-base mb-4 md:mb-5 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        style={{ color: colors.text.secondary }}
      >
        Create your first coupon to offer discounts to customers
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="flex items-center gap-2 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 shadow-md text-xs md:text-sm lg:text-base border-2"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)"
              : "linear-gradient(90deg, #00C8FF 0%, #0A2A6B 100%)",
          color: colors.text.inverse,
          border: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Plus size={14} className="md:w-4 md:h-4" color={colors.interactive.primary} />
        Create Coupon
      </button>
    </div>
  </div>
);

export default CouponsEmptyState;
