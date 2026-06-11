import React from "react";
import { useNavigate } from "react-router-dom";
import FormButton from "../../components/Button/FormButton";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface CartEmptyProps {
  onContinueShopping: () => void;
}

const CartEmpty: React.FC<CartEmptyProps> = ({ onContinueShopping }) => {
  const { colors } = useAdminTheme();
  const navigate = useNavigate();

  return (
    <div
      className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-xl border px-5 py-10 text-center sm:px-8 sm:py-14"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      {/* Empty Cart Icon */}
      <div className="mb-5 sm:mb-6">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full sm:h-28 sm:w-28"
          style={{ backgroundColor: colors.background.secondary }}
        >
          <svg
            className="h-10 w-10 sm:h-14 sm:w-14"
            style={{ color: colors.interactive.primary }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l1.5 6m0 0h8.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
            />
          </svg>
        </div>
      </div>

      {/* Empty Cart Message */}
      <h2
        className="mb-3 text-xl font-bold sm:text-2xl"
        style={{ color: colors.text.primary }}
      >
        Your cart is empty
      </h2>
      <p
        className="mb-6 max-w-sm text-sm leading-relaxed sm:text-base"
        style={{ color: colors.text.secondary }}
      >
        Looks like you haven't added anything yet. Browse software and ebooks to find what you need.
      </p>

      {/* Action Button */}
      <FormButton
        variant="primary"
        className="px-6 py-2.5 text-sm sm:px-8 sm:py-3 sm:text-base"
        onClick={onContinueShopping}
      >
        Start Shopping
      </FormButton>

      {/* Additional Links - Clickable navigation */}
      <div className="mt-6 flex flex-col items-center justify-center gap-2 text-xs sm:flex-row sm:gap-4 sm:text-sm">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="font-medium transition-colors duration-200 hover:underline cursor-pointer"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = (colors as any).interactive?.primaryHover || colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.interactive.primary;
          }}
        >
          View Popular Software
        </button>
        <span className="hidden sm:inline" style={{ color: colors.text.accent }}>
          •
        </span>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="font-medium transition-colors duration-200 hover:underline cursor-pointer"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = (colors as any).interactive?.primaryHover || colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.interactive.primary;
          }}
        >
          Browse Categories
        </button>
        <span className="hidden sm:inline" style={{ color: colors.text.accent }}>
          •
        </span>
        <button
          type="button"
          onClick={() => navigate("/deals")}
          className="font-medium transition-colors duration-200 hover:underline cursor-pointer"
          style={{ color: colors.interactive.primary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = (colors as any).interactive?.primaryHover || colors.interactive.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.interactive.primary;
          }}
        >
          Check Deals
        </button>
      </div>
    </div>
  );
};

export default CartEmpty;
