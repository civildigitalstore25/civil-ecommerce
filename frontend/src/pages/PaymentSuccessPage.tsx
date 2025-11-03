import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { CheckCircle } from "lucide-react";

const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();

  const { orderId, paymentId, amount } = location.state || {};

  React.useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div
        className="max-w-md w-full p-8 rounded-2xl shadow-xl text-center"
        style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
        }}
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: colors.text.primary }}
        >
          Payment Successful!
        </h1>

        <p className="text-lg mb-6" style={{ color: colors.text.secondary }}>
          Thank you for your order. Your payment has been processed
          successfully.
        </p>

        <div
          className="bg-gray-50 p-4 rounded-lg mb-6 text-left"
          style={{ borderLeft: `4px solid ${colors.interactive.primary}` }}
        >
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order ID:</span>
            <span className="text-gray-700 font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Payment ID:</span>
            <span className="text-gray-700 font-mono text-sm">{paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Paid:</span>
            <span className="text-green-600 font-bold">
              ₹{amount?.toFixed(2)}
            </span>
          </div>
        </div>

        <div
          className="text-sm mb-6 p-3 rounded"
          style={{
            backgroundColor: colors.background.primary,
            color: colors.text.secondary,
          }}
        >
          📧 Order confirmation has been sent to your email and WhatsApp.
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 py-3 px-6 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.interactive.primary,
              color: "white",
            }}
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 px-6 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
              border: `1px solid ${colors.border.primary}`,
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
