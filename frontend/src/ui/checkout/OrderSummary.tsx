import React from "react";
import FormButton from "../../components/Button/FormButton";

interface CartItem {
  id: string | number;
  product: { name: string; price: number | string };
  quantity: number;
}

interface Summary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  summary: Summary;
  colors: any;
  normalizePrice: (price: any) => number;
  formatPriceWithSymbol: (priceINR: number, priceUSD?: number) => string;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
  isProcessing?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  summary,
  colors,
  normalizePrice,
  formatPriceWithSymbol,
  couponCode,
  setCouponCode,
  applyCoupon,
  isProcessing = false,
}) => {
  return (
    <div
      className="space-y-6 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-shadow duration-200"
      style={{
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        border: `1px solid ${colors.border.primary}`,
      }}
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text.primary }}
      >
        Your Order
      </h2>

      <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex justify-between py-2 text-sm">
            <span style={{ color: colors.text.primary }}>
              {item.product.name} × {Number(item.quantity) || 1}
            </span>
            <span className="font-medium text-white-800">
              {formatPriceWithSymbol(
                normalizePrice(item.product.price) * Number(item.quantity),
              )}
            </span>
          </div>
        ))
      )}

      <hr className="my-4" style={{ borderColor: colors.border.primary }} />

      {/* Breakdown */}
      <div
        className="flex justify-between text-sm mb-2"
        style={{ color: colors.text.secondary }}
      >
        <span>Subtotal</span>
        <span>{formatPriceWithSymbol(normalizePrice(summary.subtotal))}</span>
      </div>

      {summary.discount > 0 && (
        <div
          className="flex justify-between text-sm mb-2"
          style={{ color: "green" }}
        >
          <span>Discount</span>
          <span>
            -{formatPriceWithSymbol(normalizePrice(summary.discount))}
          </span>
        </div>
      )}

      <div
        className="flex justify-between text-lg font-bold mb-6"
        style={{ color: colors.text.primary }}
      >
        <span>Total</span>
        <span className="text-yellow-600">
          {formatPriceWithSymbol(normalizePrice(summary.total))}
        </span>
      </div>

      {/* Coupon Section */}
      <div
        className="p-4 rounded-lg mb-4"
        style={{
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: colors.text.primary }}
        >
          Have a Coupon Code?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors duration-200"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary,
            }}
          />
          <button
            type="button"
            onClick={applyCoupon}
            className="px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "#ffffff",
            }}
          >
            Apply
          </button>
        </div>
      </div>

      <div
        className="p-4 rounded-md mb-4 text-sm leading-relaxed"
        style={{
          backgroundColor: colors.background.tertiary,
          color: colors.text.secondary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <strong style={{ color: colors.text.primary }}>
          Razorpay Payment Gateway
        </strong>
        <br />
        All UPI apps, Debit and Credit Cards, and NetBanking accepted | Powered
        by Razorpay
      </div>

      <p
        className="text-xs mb-6 leading-snug"
        style={{ color: colors.text.secondary }}
      >
        Your personal data will be used to process your order, support your
        experience, and for purposes described in our{" "}
        <a
          href="/privacy-policy"
          className="underline"
          style={{ color: colors.interactive.primary }}
        >
          privacy policy
        </a>
        .
      </p>

      <FormButton
        type="submit"
        variant="primary"
        className={`w-full py-3 text-lg transition duration-300 ease-in-out 
                   bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md 
                   hover:shadow-lg ${isProcessing ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          "PLACE ORDER"
        )}
      </FormButton>
    </div>
  );
};

export default OrderSummary;
