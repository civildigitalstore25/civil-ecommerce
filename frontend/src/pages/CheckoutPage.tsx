import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { toast } from "react-hot-toast";
import BillingForm from "../ui/checkout/BillingForm";
import OrderSummary from "../ui/checkout/OrderSummary";
import CouponForm from "../ui/checkout/CouponForm";

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  id: string | number;
  product: { name: string; price: number };
  quantity: number;
}

interface Summary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  const rawCartItems: any[] = location.state?.items || [];
  const rawSummary: any = location.state?.summary || {};

  const cartItems: CartItem[] = rawCartItems.map(item => ({
    id: item._id || item.id || item.product?._id,
    product: {
      name: item.product?.name || "Unknown Product",
      price: Number(item.price || item.product?.price || item.totalPrice) || 0,
    },
    quantity: Number(item.quantity) || 1,
  }));

  const summary: Summary = {
    subtotal: Number(rawSummary.subtotal) || 0,
    tax: Number(rawSummary.tax) || 0,
    discount: Number(rawSummary.discount) || 0,
    total: Number(rawSummary.total) || 0,
    itemCount: Number(rawSummary.itemCount) || cartItems.length,
  };

  const [formData, setFormData] = useState({ name: "", whatsapp: "", email: "" });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizePrice = (price: any) =>
    parseFloat(String(price || 0).replace(/[^0-9.]/g, "")) || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Please enter your WhatsApp number");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.whatsapp.replace(/[^0-9]/g, ''))) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    return true;
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');

      if (!token) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const subtotal = normalizePrice(summary.subtotal);
      const tax = normalizePrice(summary.tax);
      const finalTotal = subtotal + tax - discount;

      // Create order on backend
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id.toString(),
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: null
        })),
        subtotal: subtotal,
        discount: discount,
        shippingCharges: 0,
        tax: tax,
        totalAmount: finalTotal,
        shippingAddress: {
          fullName: formData.name,
          phoneNumber: formData.whatsapp,
          addressLine1: "N/A",
          city: "N/A",
          state: "N/A",
          pincode: "000000",
          country: "India"
        },
        couponCode: couponCode || null,
        notes: `Email: ${formData.email}`
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "Your Store Name",
        description: `Order #${data.data.orderId}`,
        order_id: data.data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              }
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              toast.success("Payment successful!");
              
              // Clear cart (if you have a cart clearing function)
              localStorage.removeItem('cart');
              
              // Navigate to success page
              navigate('/payment-success', {
                state: {
                  orderId: data.data.orderId,
                  paymentId: response.razorpay_payment_id,
                  amount: finalTotal
                }
              });
            } else {
              toast.error("Payment verification failed");
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error("Payment verification failed");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.whatsapp
        },
        notes: {
          orderId: data.data.orderId,
        },
        theme: {
          color: "#F59E0B"
        },
        modal: {
          ondismiss: function() {
            toast.error("Payment cancelled");
            setIsProcessing(false);
            
            // Report payment failure
            fetch(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/failed`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: data.data.razorpayOrderId,
                  error: { description: 'Payment cancelled by user' }
                })
              }
            );
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', async function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setIsProcessing(false);
        
        // Report payment failure
        await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/failed`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: data.data.razorpayOrderId,
              error: response.error
            })
          }
        );
      });

      razorpay.open();
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error("Failed to process order. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePlaceOrder();
  };

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    const subtotal = normalizePrice(summary.subtotal);
    let newDiscount = 0;

    if (code === "SAVE10") {
      newDiscount = subtotal * 0.1;
    } else if (code === "FLAT50") {
      newDiscount = 50;
    } else {
      toast.error("Invalid coupon code");
      return;
    }

    setDiscount(newDiscount);
    toast.success(`Coupon applied! Discount: ₹${newDiscount.toFixed(2)}`);
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 md:px-12 pt-20"
      style={{ backgroundColor: colors.background.primary }}
    >
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: colors.text.primary }}
      >
        Checkout
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        <div className="text-sm flex flex-col gap-2">
          <div className="flex items-center gap-2" style={{ color: colors.text.primary }}>
            <span>Have a coupon?</span>
            <button
              type="button"
              className="underline font-medium"
              style={{ color: colors.interactive.primary }}
              onClick={() => setShowCoupon(prev => !prev)}
            >
              Click here to enter your code
            </button>
          </div>
          {showCoupon && (
            <div className="mt-2 max-w-md">
              <CouponForm
                colors={colors}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                applyCoupon={applyCoupon}
              />
            </div>
          )}
        </div>

        <form
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
          onSubmit={handleSubmit}
        >
          <BillingForm formData={formData} handleChange={handleChange} colors={colors} />
          <OrderSummary
            cartItems={cartItems}
            summary={{
              subtotal: summary.subtotal,
              tax: summary.tax,
              discount: discount,
              total: summary.total - discount,
              itemCount: summary.itemCount,
            }}
            colors={colors}
            normalizePrice={normalizePrice}
            formatPriceWithSymbol={formatPriceWithSymbol}
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;