import React from "react";
import FormButton from "../../components/Button/FormButton";

interface CartItem {
  id: string | number;
  product: { name: string; price: number | string };
  quantity: number;
}

interface Summary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  summary: Summary;
  colors: any;
  normalizePrice: (price: any) => number;
  onPlaceOrder: () => void;
  isProcessing?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, 
  summary, 
  colors, 
  normalizePrice,
  onPlaceOrder,
  isProcessing = false
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
      <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>Your Order</h2>

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
            <span className="font-medium text-blue-800">
              ₹{(normalizePrice(item.product.price) * Number(item.quantity)).toFixed(2)}
            </span>
          </div>
        ))
      )}

      <hr className="my-4" style={{ borderColor: colors.border.primary }} />

      {/* Breakdown */}
      <div className="flex justify-between text-sm mb-2" style={{ color: colors.text.secondary }}>
        <span>Subtotal</span>
        <span>₹{normalizePrice(summary.subtotal).toFixed(2)}</span>
      </div>

      {summary.tax > 0 && (
        <div className="flex justify-between text-sm mb-2" style={{ color: colors.text.secondary }}>
          <span>Tax</span>
          <span>₹{normalizePrice(summary.tax).toFixed(2)}</span>
        </div>
      )}

      {summary.discount > 0 && (
        <div className="flex justify-between text-sm mb-2" style={{ color: "red" }}>
          <span>Discount</span>
          <span>-₹{normalizePrice(summary.discount).toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between text-lg font-bold mb-6" style={{ color: colors.text.primary }}>
        <span>Total</span>
        <span className="text-yellow-600">₹{normalizePrice(summary.total).toFixed(2)}</span>
      </div>

      <div className="bg-gray-100 p-4 rounded-md mb-4 text-sm text-gray-600 leading-relaxed">
        <strong>PhonePe Payment Solutions</strong>
        <br />
        All UPI apps, Debit and Credit Cards, and NetBanking accepted | Powered by PhonePe
      </div>

      <p className="text-xs text-gray-500 mb-6 leading-snug">
        Your personal data will be used to process your order, support your experience, and for purposes described in our{" "}
        <a href="/privacy-policy" className="text-yellow-600 underline">privacy policy</a>.
      </p>

      <FormButton
        type="button"
        variant="primary"
        className={`w-full py-3 text-lg transition duration-300 ease-in-out 
                   bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md 
                   hover:shadow-lg ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={onPlaceOrder}
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
          'PLACE ORDER'
        )}
      </FormButton>
    </div>
  );
};

export default OrderSummary;