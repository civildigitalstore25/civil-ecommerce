import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCartContext } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
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
  discount: number;
  total: number;
  itemCount: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const { clearCart } = useCartContext();

  const rawCartItems: any[] = location.state?.items || [];
  const rawSummary: any = location.state?.summary || {};

  const cartItems: CartItem[] = rawCartItems.map((item) => ({
    id: item._id || item.id || item.product?._id,
    product: {
      name: item.product?.name || "Unknown Product",
      price: Number(item.price || item.product?.price || item.totalPrice) || 0,
    },
    quantity: Number(item.quantity) || 1,
  }));

  const summary: Summary = {
    subtotal: Number(rawSummary.subtotal) || 0,
    discount: Number(rawSummary.discount) || 0,
    total: Number(rawSummary.total) || 0,
    itemCount: Number(rawSummary.itemCount) || cartItems.length,
  };

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
  });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const normalizePrice = (price: any) =>
    parseFloat(String(price || 0).replace(/[^0-9.]/g, "")) || 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    // Updated validation to handle country code format (+CountryCode followed by phone number)
    const phoneWithCountryCode = formData.whatsapp.replace(/\s/g, ""); // Remove spaces
    const phoneRegex = /^\+\d{1,4}\d{7,15}$/; // Country code (1-4 digits) + phone number (7-15 digits)
    if (!phoneRegex.test(phoneWithCountryCode)) {
      toast.error("Please enter a valid phone number with country code");
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
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
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
      const finalTotal = subtotal - discount;

      // Create order on backend
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id.toString(),
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: null,
        })),
        subtotal: subtotal,
        discount: discount,
        shippingCharges: 0,
        totalAmount: finalTotal,
        shippingAddress: {
          fullName: formData.name,
          phoneNumber: formData.whatsapp,
          addressLine1: "N/A",
          city: "N/A",
          state: "N/A",
          pincode: "000000",
          country: "India",
        },
        couponCode: couponCode || null,
        notes: `Email: ${formData.email}`,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        },
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
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Clear cart from backend and localStorage
              try {
                await clearCart();
              } catch (error) {
                console.error("Failed to clear cart:", error);
                // Continue anyway, cart will be cleared on next refresh
              }

              // Show SweetAlert success message
              await Swal.fire({
                icon: "success",
                title: "Payment Successful!",
                html: `
                  <div style="text-align: left; margin-top: 20px;">
                    <p style="margin-bottom: 15px;">Thank you for your order. Your payment has been processed successfully.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>Order ID:</strong>
                        <span style="font-family: monospace;">${data.data.orderId}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>Payment ID:</strong>
                        <span style="font-family: monospace; font-size: 12px;">${response.razorpay_payment_id}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <strong>Amount Paid:</strong>
                        <span style="color: #10b981; font-weight: bold;">₹${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style="background: #fef3c7; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 14px;">
                      📧 Order confirmation has been sent to your email and WhatsApp.
                    </div>
                  </div>
                `,
                showCancelButton: true,
                confirmButtonText: "View Orders",
                cancelButtonText: "Continue Shopping",
                confirmButtonColor: "#10b981",
                cancelButtonColor: "#6b7280",
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/my-orders");
                } else {
                  navigate("/");
                }
              });
            } else {
              toast.error("Payment verification failed");
              setIsProcessing(false);
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.whatsapp,
        },
        notes: {
          orderId: data.data.orderId,
        },
        theme: {
          color: "#F59E0B",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
            setIsProcessing(false);

            // Report payment failure
            fetch(
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/payments/failed`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: data.data.razorpayOrderId,
                  error: { description: "Payment cancelled by user" },
                }),
              },
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setIsProcessing(false);

        // Report payment failure
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/payments/failed`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: data.data.razorpayOrderId,
              error: response.error,
            }),
          },
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
      Swal.fire({
        icon: "warning",
        title: "Missing Coupon Code",
        html: `
          <div style="text-align: left; margin-top: 10px;">
            <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">⚠️</span>
                <strong style="color: #92400e; font-size: 16px;">Please enter a coupon code</strong>
              </div>
            </div>
            <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
              💡 Enter your coupon code in the field above to apply discount.
            </div>
          </div>
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const subtotal = normalizePrice(summary.subtotal);

    try {
      // Validate coupon with backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/coupons/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            subtotal: subtotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Determine the error type for appropriate message
        const errorMessage = data.message || "Invalid coupon code";
        let icon: "error" | "warning" | "info" = "error";
        let title = "Coupon Invalid";
        let iconColor = "#ef4444";
        let bgColor = "#fef2f2";
        let borderColor = "#ef4444";

        // Check for specific error types
        if (errorMessage.includes("usage limit reached") || errorMessage.includes("validity expired")) {
          icon = "warning";
          title = "Coupon Limit Reached";
          iconColor = "#f59e0b";
          bgColor = "#fffbeb";
          borderColor = "#f59e0b";
        } else if (errorMessage.includes("expired")) {
          icon = "info";
          title = "Coupon Expired";
          iconColor = "#3b82f6";
          bgColor = "#eff6ff";
          borderColor = "#3b82f6";
        } else if (errorMessage.includes("not yet valid")) {
          icon = "info";
          title = "Coupon Not Yet Active";
          iconColor = "#8b5cf6";
          bgColor = "#f5f3ff";
          borderColor = "#8b5cf6";
        } else if (errorMessage.includes("no longer active") || errorMessage.includes("Inactive")) {
          icon = "warning";
          title = "Coupon Validity Expired";
          iconColor = "#f59e0b";
          bgColor = "#fffbeb";
          borderColor = "#f59e0b";
        }

        Swal.fire({
          icon: icon,
          title: title,
          html: `
            <div style="text-align: left; margin-top: 10px;">
              <div style="background: ${bgColor}; padding: 15px; border-radius: 8px; border-left: 4px solid ${borderColor}; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-size: 24px;">${icon === "error" ? "❌" : icon === "warning" ? "⚠️" : "ℹ️"}</span>
                  <strong style="color: ${iconColor === "#ef4444" ? "#991b1b" : iconColor === "#f59e0b" ? "#92400e" : "#1e40af"}; font-size: 16px;">${errorMessage}</strong>
                </div>
                ${code ? `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; border-radius: 6px;">
                  <span style="color: #6b7280;">Entered Code:</span>
                  <span style="font-family: monospace; background: #e5e7eb; color: #374151; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${code}</span>
                </div>
                ` : ""}
              </div>
              <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
                💡 <strong>Tip:</strong> Check the coupon code and try again, or browse our active offers.
              </div>
            </div>
          `,
          confirmButtonText: "Try Another Code",
          confirmButtonColor: iconColor,
          showCancelButton: true,
          cancelButtonText: "Close",
          cancelButtonColor: "#6b7280",
        });
        return;
      }

      if (data.success) {
        const discountAmount = data.coupon.discountAmount;
        setDiscount(discountAmount);
        setCouponCode(code);

        // Show success message with SweetAlert
        Swal.fire({
          icon: "success",
          title: "Coupon Applied Successfully!",
          html: `
            <div style="text-align: left; margin-top: 10px;">
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <strong style="color: #065f46; font-size: 16px;">Coupon Code:</strong>
                  <span style="font-family: monospace; background: #10b981; color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold;">${data.coupon.code}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #065f46;">Offer:</span>
                  <span style="color: #065f46; font-weight: 600;">${data.coupon.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #065f46;">Discount:</span>
                  <span style="color: #10b981; font-weight: bold; font-size: 18px;">
                    ${data.coupon.discountType === 'Percentage' ? `${data.coupon.discountValue}%` : `₹${data.coupon.discountValue}`}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #065f46;">You Save:</span>
                  <span style="color: #10b981; font-weight: bold; font-size: 18px;">₹${discountAmount.toFixed(2)}</span>
                </div>
              </div>
             
            </div>
          `,
          confirmButtonText: "Continue",
          confirmButtonColor: "#10b981",
          timer: 5000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error validating coupon:", error);

      Swal.fire({
        icon: "error",
        title: "Connection Error",
        html: `
          <div style="text-align: left; margin-top: 10px;">
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 24px;">🔌</span>
                <strong style="color: #991b1b; font-size: 16px;">Unable to validate coupon</strong>
              </div>
              <p style="color: #7f1d1d; margin: 0;">Please check your internet connection and try again.</p>
            </div>
            <div style="background: #f3f4f6; padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; color: #4b5563;">
              🔄 If the problem persists, please refresh the page or contact support.
            </div>
          </div>
        `,
        confirmButtonText: "Retry",
        confirmButtonColor: "#ef4444",
        showCancelButton: true,
        cancelButtonText: "Close",
        cancelButtonColor: "#6b7280",
      }).then((result) => {
        if (result.isConfirmed) {
          applyCoupon();
        }
      });
    }
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
          <div
            className="flex items-center gap-2"
            style={{ color: colors.text.primary }}
          >
            <span>Have a coupon?</span>
            <button
              type="button"
              className="underline font-medium"
              style={{ color: colors.interactive.primary }}
              onClick={() => setShowCoupon((prev) => !prev)}
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
          <BillingForm
            formData={formData}
            handleChange={handleChange}
            colors={colors}
          />
          <OrderSummary
            cartItems={cartItems}
            summary={{
              subtotal: summary.subtotal,
              discount: discount,
              total: summary.subtotal - discount,
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
