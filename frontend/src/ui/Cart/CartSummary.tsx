import React, { useRef, useEffect } from 'react';
import type { CartSummary as CartSummaryType } from '../../types/cartTypes';
import FormButton from '../../components/Button/FormButton';
import { useAdminTheme } from '../../contexts/AdminThemeContext';

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
  isLoading = false
}) => {
  const { colors } = useAdminTheme();

  // Refs for direct DOM updates
  const itemCountRef = useRef<HTMLSpanElement>(null);
  const subtotalRef = useRef<HTMLSpanElement>(null);
  const taxRef = useRef<HTMLSpanElement>(null);
  const discountRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);

  // Update summary display without re-render
  useEffect(() => {
    if (itemCountRef.current) {
      itemCountRef.current.textContent = summary.itemCount.toString();
    }
    if (subtotalRef.current) {
      subtotalRef.current.textContent = `₹${summary.subtotal.toLocaleString()}`;
    }
    if (taxRef.current) {
      taxRef.current.textContent = `₹${summary.tax.toLocaleString()}`;
    }
    if (totalRef.current) {
      totalRef.current.textContent = `₹${summary.total.toLocaleString()}`;
    }
    if (discountRef.current) {
      discountRef.current.style.display = summary.discount > 0 ? 'flex' : 'none';
      if (summary.discount > 0) {
        const discountSpan = discountRef.current.querySelector('span:last-child');
        if (discountSpan) {
          discountSpan.textContent = `-₹${summary.discount.toLocaleString()}`;
        }
      }
    }
  }, [summary]);

  return (
    <div
      className="rounded-xl border p-6 sticky top-6 transition-colors duration-200"
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary
      }}
    >
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: colors.text.primary }}
      >
        Order Summary
      </h2>

      {/* Summary Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span style={{ color: colors.text.secondary }}>
            Subtotal (<span ref={itemCountRef}>{summary.itemCount}</span> items)
          </span>
          <span
            ref={subtotalRef}
            className="font-medium"
            style={{ color: colors.text.primary }}
          >
            ₹{summary.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: colors.text.secondary }}>Tax (GST)</span>
          <span
            ref={taxRef}
            className="font-medium"
            style={{ color: colors.text.primary }}
          >
            ₹{summary.tax.toLocaleString()}
          </span>
        </div>

        <div
          ref={discountRef}
          className="flex justify-between text-sm"
          style={{ display: summary.discount > 0 ? 'flex' : 'none' }}
        >
          <span style={{ color: colors.status.success }}>Discount</span>
          <span
            className="font-medium"
            style={{ color: colors.status.success }}
          >
            -₹{summary.discount.toLocaleString()}
          </span>
        </div>

        <div
          className="border-t pt-3"
          style={{ borderColor: colors.border.primary }}
        >
          <div className="flex justify-between">
            <span
              className="text-lg font-semibold"
              style={{ color: colors.text.primary }}
            >
              Total
            </span>
            <span
              ref={totalRef}
              className="text-lg font-bold"
              style={{ color: colors.text.primary }}
            >
              ₹{summary.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <FormButton
          variant="primary"
          className="w-full py-3 text-lg"
          onClick={onCheckout}
          disabled={isLoading || summary.itemCount === 0}
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </FormButton>

        <button
          onClick={onContinueShopping}
          className="w-full py-3 border rounded-lg font-medium transition-colors duration-200"
          style={{
            color: colors.text.primary,
            borderColor: colors.border.primary,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.interactive.secondaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Continue Shopping
        </button>
      </div>

      {/* Trust Indicators */}
      <div
        className="mt-6 pt-6 border-t"
        style={{ borderColor: colors.border.primary }}
      >
        <div
          className="flex items-center justify-center space-x-6 text-xs"
          style={{ color: colors.text.secondary }}
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure Checkout
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Instant Download
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Genuine License
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;