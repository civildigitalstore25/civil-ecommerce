import React, { useRef, useEffect } from "react";
import type { CartSummary as CartSummaryType } from "../../types/cartTypes";
import FormButton from "../../components/Button/FormButton";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout: () => void;
  onContinueShopping: () => void;
  isLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  onCheckout,
  onContinueShopping,
  isLoading = false,
}) => {
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  // Refs for direct DOM updates
  const itemCountRef = useRef<HTMLSpanElement>(null);
  const subtotalRef = useRef<HTMLSpanElement>(null);
  const discountRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  // Update summary display without re-render
  useEffect(() => {
    if (itemCountRef.current) {
      itemCountRef.current.textContent = summary.itemCount.toString();
    }
    if (subtotalRef.current) {
      subtotalRef.current.textContent = formatPriceWithSymbol(summary.subtotal);
    }
    if (totalRef.current) {
      totalRef.current.textContent = formatPriceWithSymbol(summary.total);
    }
    if (discountRef.current) {
      discountRef.current.style.display =
        summary.discount > 0 ? "flex" : "none";
      if (summary.discount > 0) {
        const discountSpan =
          discountRef.current.querySelector("span:last-child");
        if (discountSpan) {
          discountSpan.textContent = `-${formatPriceWithSymbol(summary.discount)}`;
        }
      }
    }
  }, [summary, formatPriceWithSymbol]);

  return (
    <div
      className="sticky top-6 rounded-xl border p-4 transition-colors duration-200 sm:p-6"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      <h2
        className="mb-4 text-lg font-bold sm:mb-6 sm:text-xl"
        style={{ color: colors.text.primary }}
      >
        Order Summary
      </h2>

      {/* Summary Details */}
      <div className="mb-5 space-y-3 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm">
          <span style={{ color: colors.text.secondary }}>
            Subtotal (<span ref={itemCountRef}>{summary.itemCount}</span> items)
          </span>
          <span
            ref={subtotalRef}
            className="font-medium"
            style={{ color: colors.text.primary }}
          >
            {formatPriceWithSymbol(summary.subtotal)}
          </span>
        </div>

        <div
          ref={discountRef}
          className="flex justify-between text-xs sm:text-sm"
          style={{ display: summary.discount > 0 ? "flex" : "none" }}
        >
          <span style={{ color: colors.status.success }}>Discount</span>
          <span
            className="font-medium"
            style={{ color: colors.status.success }}
          >
            -{formatPriceWithSymbol(summary.discount)}
          </span>
        </div>

        <div
          className="border-t pt-3"
          style={{ borderColor: colors.border.primary }}
        >
          <div className="flex justify-between">
            <span
              className="text-base font-semibold sm:text-lg"
              style={{ color: colors.text.primary }}
            >
              Total
            </span>
            <span
              ref={totalRef}
              className="text-base font-bold sm:text-lg"
              style={{ color: colors.text.primary }}
            >
              {formatPriceWithSymbol(summary.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <FormButton
          variant="primary"
          className="w-full py-2.5 text-sm sm:py-3 sm:text-lg"
          onClick={onCheckout}
          disabled={isLoading || summary.itemCount === 0}
        >
          {isLoading ? "Processing..." : "Proceed to Checkout"}
        </FormButton>

        <button
          onClick={onContinueShopping}
          className="w-full rounded-lg border py-2.5 text-sm font-medium transition-colors duration-200 sm:py-3 sm:text-base"
          style={{
            color: colors.text.primary,
            borderColor: colors.border.primary,
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              colors.interactive.secondaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Continue Shopping
        </button>
      </div>

      {/* Trust Indicators */}
      <div
        className="mt-5 border-t pt-5 sm:mt-6 sm:pt-6"
        style={{ borderColor: colors.border.primary }}
      >
        <div
          className="grid grid-cols-3 gap-2 text-center text-[10px] sm:flex sm:items-center sm:justify-center sm:space-x-6 sm:text-xs"
          style={{ color: colors.text.secondary }}
        >
          <div className="flex flex-col items-center gap-1 sm:flex-row">
            <svg
              className="h-3.5 w-3.5 sm:mr-1 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure Checkout
          </div>
          <div className="flex flex-col items-center gap-1 sm:flex-row">
            <svg
              className="h-3.5 w-3.5 sm:mr-1 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Instant Download
          </div>
          <div className="flex flex-col items-center gap-1 sm:flex-row">
            <svg
              className="h-3.5 w-3.5 sm:mr-1 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Genuine License
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
