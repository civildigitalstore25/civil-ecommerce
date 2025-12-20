import React from "react";
import FormButton from "../../components/Button/FormButton";
import axios from "axios";
import { toast } from "react-hot-toast";

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
  user?: any;
  shippingAddress?: any;
  clearCart?: () => void;
  navigate?: any;
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
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
  user,
  shippingAddress,
  clearCart,
  navigate
}) => {
  const [showGatewayModal, setShowGatewayModal] = React.useState(false);
  const [selectedGateway, setSelectedGateway] = React.useState<'razorpay' | 'phonepe' | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Debug modal state
  React.useEffect(() => {
    console.log('🎭 Modal state changed:', showGatewayModal);
  }, [showGatewayModal]);

  // Handler for Place Order button
  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔘 Place Order button clicked');
    console.log('👤 User:', user);
    console.log('🛒 Cart Items:', cartItems);
    
    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      console.log('❌ Cart is empty');
      return;
    }

    // Validate user authentication
    if (!user) {
      toast.error('Please login to place order');
      console.log('❌ User not authenticated');
      return;
    }

    console.log('✅ Opening payment gateway modal');
    setShowGatewayModal(true);
  };

  // Handler for selecting a gateway
  const handleGatewaySelect = async (gateway: 'razorpay' | 'phonepe') => {
    setSelectedGateway(gateway);
    setShowGatewayModal(false);
    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication required. Please login.');
        setLoading(false);
        return;
      }

      // Prepare order payload
      const payload: any = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.product.price),
        })),
        subtotal: summary.subtotal,
        discount: summary.discount,
        totalAmount: summary.total,
        shippingCharges: 0,
        shippingAddress: shippingAddress || {
          fullName: user?.fullName || user?.name || 'Customer',
          phoneNumber: user?.phoneNumber || 'N/A',
          addressLine1: 'N/A',
          city: 'N/A',
          state: 'N/A',
          pincode: '000000',
          country: 'India'
        },
        couponCode: couponCode || null,
        notes: '',
        gateway,
        callbackUrl: `${window.location.origin}/payment/callback`
      };

      console.log('📦 Creating order with payload:', payload);

      const res = await axios.post(
        `${API_BASE_URL}/api/payments/create-order`, 
        payload, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = res.data?.data;
      console.log('✅ Order created:', data);

      if (gateway === 'razorpay' && data?.razorpayOrderId) {
        // Load Razorpay script if not loaded
        if (!window.Razorpay) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency || 'INR',
          order_id: data.razorpayOrderId,
          name: 'Order Payment',
          description: `Order #${data.orderId}`,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyRes = await axios.post(
                `${API_BASE_URL}/api/payments/verify`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                },
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );

              if (verifyRes.data.success) {
                toast.success('Payment successful!');
                clearCart && clearCart();
                navigate && navigate('/my-orders');
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error: any) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user?.fullName || user?.name,
            email: user?.email,
            contact: user?.phoneNumber || ''
          },
          theme: { 
            color: '#0A2A6B' 
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              toast.error('Payment cancelled');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          toast.error('Payment failed: ' + response.error.description);
          setLoading(false);
        });
        rzp.open();
        setLoading(false);

      } else if (gateway === 'phonepe' && data?.paymentUrl) {
        // Store order details for callback
        sessionStorage.setItem('phonepe_order_id', data.orderId);
        sessionStorage.setItem('phonepe_transaction_id', data.merchantTransactionId);
        
        // Redirect to PhonePe payment URL
        toast.success('Redirecting to PhonePe...');
        setTimeout(() => {
          window.location.href = data.paymentUrl;
        }, 1000);

      } else {
        toast.error('Payment initiation failed. Please try again.');
        setLoading(false);
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Payment failed';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

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
      >
        <strong style={{ color: colors.text.primary }}>
          Multiple Payment Options
        </strong>
        <br />
        Pay with Razorpay (Cards, UPI, NetBanking) or PhonePe (UPI)
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

      {/* Payment Gateway Modal */}
      {showGatewayModal && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh',
            background: 'rgba(0,0,0,0.6)', 
            zIndex: 9999, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
          onClick={() => setShowGatewayModal(false)}
        >
          <div 
            style={{ 
              background: '#fff', 
              borderRadius: 16, 
              padding: 32, 
              minWidth: 360,
              maxWidth: 450,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)', 
              textAlign: 'center' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ 
              fontSize: 24, 
              marginBottom: 8, 
              color: '#1a1a1a',
              fontWeight: 'bold'
            }}>
              Choose Payment Method
            </h2>
            <p style={{ 
              fontSize: 14, 
              color: '#666', 
              marginBottom: 24 
            }}>
              Select your preferred payment gateway
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                style={{ 
                  padding: '16px 24px', 
                  fontSize: 16, 
                  fontWeight: '600',
                  borderRadius: 10, 
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
                }}
                onClick={() => handleGatewaySelect('razorpay')}
              >
                💳 Pay with Razorpay
              </button>
              
              <button
                style={{ 
                  padding: '16px 24px', 
                  fontSize: 16, 
                  fontWeight: '600',
                  borderRadius: 10, 
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                }}
                onClick={() => handleGatewaySelect('phonepe')}
              >
                📱 Pay with PhonePe
              </button>
              
              <button
                style={{ 
                  marginTop: 12, 
                  color: '#666', 
                  background: 'none', 
                  border: 'none', 
                  fontSize: 14, 
                  cursor: 'pointer',
                  padding: '8px'
                }}
                onClick={() => setShowGatewayModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <FormButton
        type="button"
        variant="primary"
        className={`w-full py-3 text-lg transition duration-300 ease-in-out 
                   bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md 
                   hover:shadow-lg ${isProcessing || loading ? "opacity-70 cursor-not-allowed" : ""}`}
        disabled={isProcessing || loading}
        onClick={handlePlaceOrderClick}
      >
        {isProcessing || loading ? (
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
