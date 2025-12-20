import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../api/userQueries";
import { useAppForm } from "../hooks/useAppForm";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCartContext } from "../contexts/CartContext";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import BillingForm from "../ui/checkout/BillingForm";

import OrderSummary from "../ui/checkout/OrderSummary";

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useUser();
  const { colors } = useAdminTheme();
  const { currency, formatPriceWithSymbol } = useCurrency();
  const { cart, clearCart } = useCartContext();
  const [gateway, setGateway] = useState<'razorpay' | 'phonepe'>('razorpay');
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Debug user state
  React.useEffect(() => {
    console.log('🔐 Checkout Page - User state:', { user, userLoading, token: localStorage.getItem('token') });
  }, [user, userLoading]);

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

  const normalizePrice = (price: any) =>
    parseFloat(String(price || 0).replace(/[^0-9.]/g, "")) || 0;

  // Setup react-hook-form for billing form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm({
    defaultValues: {
      name: user?.fullName || "",
      whatsapp: "",
      email: user?.email || "",
    },
  });



  // Handler for form submit (no modal logic here now)
  const handlePlaceOrder = (data: any) => {
    // You can handle form validation or data collection here if needed
    // The actual payment modal is now handled in OrderSummary
    // Optionally, pass data up if needed
  };

  return (
    <div className="space-y-6" style={{ background: colors.background.primary, minHeight: '100vh' }}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit(handlePlaceOrder)}>
            <BillingForm
              register={register}
              errors={errors}
              control={control}
              colors={colors}
            />
            {/* Place Order button is now in OrderSummary */}
          </form>
        </div>
        <div className="w-full md:w-1/3">
          <OrderSummary
            cartItems={cartItems}
            summary={summary}
            colors={colors}
            normalizePrice={normalizePrice}
            formatPriceWithSymbol={formatPriceWithSymbol}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            applyCoupon={() => {}}
            isProcessing={isProcessing}
            user={user}
            shippingAddress={cart?.shippingAddress || {}}
            clearCart={clearCart}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

