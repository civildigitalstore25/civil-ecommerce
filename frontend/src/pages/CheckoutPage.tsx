import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useUser } from "../api/userQueries";
import { useAppForm } from "../hooks/useAppForm";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCartContext } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { getCheckoutSEO } from "../utils/seo";
import BillingForm from "../ui/checkout/BillingForm";
import OrderSummary from "../ui/checkout/OrderSummary";
import { 
  getBillingAddresses, 
  saveBillingAddress, 
  deleteBillingAddress,
  type BillingAddress 
} from "../api/billingAddressApi";

// Declare Cashfree on window
declare global {
  interface Window {
    Cashfree: any;
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

interface CheckoutFormData {
  name: string;
  whatsapp: string;
  email: string;
  countryCode: string;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const { clearCart } = useCartContext();
  const { data: user } = useUser();
  
  const seoData = getCheckoutSEO();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useAppForm<CheckoutFormData>({
    defaultValues: {
      name: user?.fullName || "",
      whatsapp: "",
      email: user?.email || "",
      countryCode: "+91",
    },
  });

  const rawCartItems: any[] = location.state?.items || [];
  const rawSummary: any = location.state?.summary || {};

  // Debug: Log cart items structure
  console.log('🛒 Raw Cart Items received:', rawCartItems);
  if (rawCartItems.length > 0) {
    console.log('🔍 First cart item structure:', {
      fullItem: rawCartItems[0],
      productData: rawCartItems[0].product,
      version: rawCartItems[0].product?.version,
      licenseType: rawCartItems[0].licenseType
    });
  }

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

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<BillingAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Load saved billing addresses on component mount
  useEffect(() => {
    const loadSavedAddresses = async () => {
      if (!user) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const addresses = await getBillingAddresses();
        setSavedAddresses(addresses);
      } catch (error) {
        console.error("Failed to load saved addresses:", error);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadSavedAddresses();
  }, [user]);

  // Handle selecting a saved address
  const handleSelectAddress = (address: BillingAddress) => {
    setSelectedAddressId(address._id);
    setValue("name", address.name);
    setValue("email", address.email);
    setValue("whatsapp", address.whatsapp);
    setValue("countryCode", address.countryCode);
  };

  // Handle deleting a saved address
  const handleDeleteAddress = async (addressId: string) => {
    const result = await Swal.fire({
      title: "Delete Address?",
      text: "Are you sure you want to delete this billing address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colors.interactive.primary,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteBillingAddress(addressId);
        setSavedAddresses(prev => prev.filter(addr => addr._id !== addressId));
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
        toast.success("Address deleted successfully");
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const normalizePrice = (price: any) =>
    parseFloat(String(price || 0).replace(/[^0-9.]/g, "")) || 0;

  const loadCashfreeScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const environment = import.meta.env.VITE_CASHFREE_ENV || 'sandbox';
      const scriptSrc = environment === 'production'
        ? 'https://sdk.cashfree.com/js/v3/cashfree.js'
        : 'https://sdk.cashfree.com/js/v3/cashfree.js'; // Same SDK for both environments

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (data: CheckoutFormData) => {
    // Validate cart items
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
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

      // Load Cashfree script
      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const subtotal = normalizePrice(summary.subtotal);
      const finalTotal = subtotal - discount;

      // Save billing address before payment (important for redirect-based payments)
      try {
        await saveBillingAddress({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          countryCode: data.countryCode,
        });
        console.log('✅ Billing address saved successfully');
      } catch (error) {
        console.error("Failed to save billing address:", error);
        // Don't block the payment flow if saving address fails
      }

      // Create order on backend
      const orderData = {
        items: rawCartItems.map((item) => {
          console.log('🔍 Mapping Cart Item for Order:', {
            productName: item.product?.name,
            productVersion: item.product?.version,
            licenseType: item.licenseType,
            hasProduct: !!item.product,
            hasVersion: !!item.product?.version,
            fullProductObject: item.product,
            fullItem: item
          });

          const orderItem = {
            productId: (item._id || item.id || item.product?._id).toString(),
            name: item.product?.name || "Unknown Product",
            quantity: item.quantity,
            price: Number(item.price || item.product?.price || item.totalPrice) || 0,
            image: item.product?.image || null,
            version: item.product?.version || null,
            pricingPlan: item.licenseType || null,
            driveLink: item.product?.driveLink || null, // Include download link
          };

          console.log('✅ Created Order Item:', orderItem);
          return orderItem;
        }),
        subtotal: subtotal,
        discount: discount,
        shippingCharges: 0,
        totalAmount: finalTotal,
        shippingAddress: {
          fullName: data.name,
          phoneNumber: data.whatsapp,
          addressLine1: "N/A",
          city: "N/A",
          state: "N/A",
          pincode: "000000",
          country: "India",
        },
        couponCode: couponCode || null,
        notes: `Email: ${data.email}`,
      };

      console.log('📦 Final Order Data:', orderData);

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

      const responseData = await response.json();

      if (!responseData.success) {
        toast.error(responseData.message || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      // Initialize Cashfree SDK
      const cashfree = await window.Cashfree({
        mode: responseData.data.environment || 'sandbox'
      });

      // Configure payment options
      const checkoutOptions = {
        paymentSessionId: responseData.data.paymentSessionId,
        redirectTarget: "_self", // Keep user on same page
        returnUrl: `${window.location.origin}/payment-status?order_id=${responseData.data.orderId}`
      };

      // Handle payment
      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          console.error('Payment error:', result.error);
          toast.error(result.error.message || "Payment failed");
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
                orderId: responseData.data.orderId,
                error: result.error,
              }),
            },
          );
          return;
        }

        // For redirect payments, user will be redirected to payment-status page
        if (result.redirect) {
          console.log('Payment redirected to gateway, will return to payment-status page');
          // The Cashfree SDK will handle the redirect
          return;
        }

        if (result.paymentDetails) {
          console.log('Payment completed:', result.paymentDetails);

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
                  orderId: responseData.data.orderId
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
                        <span style="font-family: monospace;">${responseData.data.orderId}</span>
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
        }
      }).catch((error: any) => {
        console.error('Cashfree checkout error:', error);
        toast.error("Payment process failed. Please try again.");
        console.error('Cashfree checkout error:', error);
        toast.error("Payment process failed. Please try again.");
        setIsProcessing(false);
      });
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error("Failed to process order. Please try again.");
      setIsProcessing(false);
    }
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
  <>
    <Helmet>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
    <div
      className="min-h-screen py-10 px-4 sm:px-6 md:px-12 pt-20"
      style={{ backgroundColor: colors.background.primary }}
    >
    <h1
      className="text-3xl font-bold mb-8 text-center mt-5"
      style={{ color: colors.text.primary }}
    >
      Checkout
    </h1>

    <form
      className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
      onSubmit={handleSubmit(handlePlaceOrder)}
    >
      <div className="space-y-6">
        {/* Saved Addresses Section */}
        {!loadingAddresses && savedAddresses.length > 0 && (
          <div
            className="rounded-xl p-4 md:p-6 border"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text.primary }}
            >
              📋 Saved Billing Details
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: colors.text.secondary }}
            >
              Select from your previously used billing details or enter new ones below
            </p>
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAddressId === address._id
                      ? "shadow-md"
                      : "hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor:
                      selectedAddressId === address._id
                        ? colors.interactive.primary
                        : colors.border.secondary,
                  }}
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selectedAddressId === address._id
                              ? "border-transparent"
                              : ""
                          }`}
                          style={{
                            backgroundColor:
                              selectedAddressId === address._id
                                ? colors.interactive.primary
                                : "transparent",
                            borderColor:
                              selectedAddressId === address._id
                                ? colors.interactive.primary
                                : colors.border.primary,
                          }}
                        >
                          {selectedAddressId === address._id && (
                            <svg
                              className="w-3 h-3"
                              fill="white"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className="font-semibold text-sm md:text-base"
                          style={{ color: colors.text.primary }}
                        >
                          {address.name}
                        </span>
                      </div>
                      <div
                        className="text-xs md:text-sm space-y-1 ml-7"
                        style={{ color: colors.text.secondary }}
                      >
                        <p>📧 {address.email}</p>
                        <p>
                          📱 {address.countryCode} {address.whatsapp}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address._id);
                      }}
                      className="ml-2 p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                      style={{
                        color: colors.status.error,
                      }}
                      title="Delete address"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <BillingForm
          register={register}
          errors={errors}
          control={control}
          colors={colors}
          setValue={setValue}
        />
      </div>
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
        isProcessing={isProcessing}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        applyCoupon={applyCoupon}
      />
    </form>
  </div>
  </>
);
};

export default CheckoutPage;
