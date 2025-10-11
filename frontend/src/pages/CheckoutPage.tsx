import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { toast } from "react-hot-toast";
import BillingForm from "../ui/checkout/BillingForm";
import OrderSummary from "../ui/checkout/OrderSummary";
import CouponForm from "../ui/checkout/CouponForm";

// Types
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

  const rawCartItems: any[] = location.state?.items || [];
  const rawSummary: any = location.state?.summary || {};

  // Handle both cart structures
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

  console.log('📦 Cart Items:', cartItems);
  console.log('💰 Summary:', summary);

  // State
  const [formData, setFormData] = useState({ name: "", whatsapp: "", email: "" });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizePrice = (price: any) =>
    parseFloat(String(price || 0).replace(/[^0-9.]/g, "")) || 0;

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validate form before placing order
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Please enter your WhatsApp number");
      return false;
    }
    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.whatsapp.replace(/[^0-9]/g, ''))) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }
    // Basic email validation
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

      const subtotal = normalizePrice(summary.subtotal);
      const tax = normalizePrice(summary.tax);
      const finalTotal = subtotal + tax - discount;

      // Prepare order data for backend
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

      console.log('📤 Sending order data:', orderData);

      // Call backend API to create order and initiate payment
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
      console.log('📥 Response from backend:', data);

      if (data.success && data.data.paymentUrl) {
        // Store order details in localStorage for callback page
        localStorage.setItem('pendingOrderId', data.data.orderId);
        localStorage.setItem('merchantTransactionId', data.data.merchantTransactionId);
        
        toast.success("Redirecting to payment gateway...");
        
        // Redirect to PhonePe payment page
        window.location.href = data.data.paymentUrl;
      } else {
        toast.error(data.message || "Failed to initiate payment");
        setIsProcessing(false);
      }
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

    try {
      // const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      // If you have a coupon validation API, call it here
      // For now, using simple validation
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
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 md:px-12"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Heading */}
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: colors.text.primary }}
      >
        Checkout
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
      
        {/* Coupon Section */}
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

        {/* Billing Form + Order Summary */}
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
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;