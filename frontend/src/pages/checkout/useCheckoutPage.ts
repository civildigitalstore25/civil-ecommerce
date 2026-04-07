import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../api/userQueries";
import { useAppForm } from "../../hooks/useAppForm";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getBillingAddresses,
  deleteBillingAddress,
  type BillingAddress,
} from "../../api/billingAddressApi";
import { getCheckoutSEO } from "../../utils/seo";
import { useCheckoutPayment } from "./useCheckoutPayment";
import { useCheckoutCoupon } from "./useCheckoutCoupon";
import type { CheckoutFormData } from "./checkoutTypes";
import {
  normalizeCheckoutPrice,
  parseCheckoutLocationState,
} from "./parseCheckoutLocationState";

export function useCheckoutPage() {
  const location = useLocation();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const { data: user } = useUser();

  const seoData = getCheckoutSEO();

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

  const { rawCartItems, cartItems, summary } = parseCheckoutLocationState(
    location.state,
  );

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<BillingAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const { isProcessing, handlePlaceOrder } = useCheckoutPayment(
    rawCartItems,
    summary,
    discount,
    couponCode,
    normalizeCheckoutPrice,
  );

  const { applyCoupon } = useCheckoutCoupon(
    couponCode,
    setCouponCode,
    setDiscount,
    summary,
    rawCartItems,
    normalizeCheckoutPrice,
  );

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

  const handleSelectAddress = (address: BillingAddress) => {
    setSelectedAddressId(address._id);
    setValue("name", address.name);
    setValue("email", address.email);
    setValue("whatsapp", address.whatsapp);
    setValue("countryCode", address.countryCode);
  };

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
        setSavedAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
        toast.success("Address deleted successfully");
      } catch {
        toast.error("Failed to delete address");
      }
    }
  };

  return {
    colors,
    formatPriceWithSymbol,
    seoData,
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    cartItems,
    summary,
    discount,
    couponCode,
    setCouponCode,
    applyCoupon,
    isProcessing,
    handlePlaceOrder,
    loadingAddresses,
    savedAddresses,
    selectedAddressId,
    handleSelectAddress,
    handleDeleteAddress,
    normalizePrice: normalizeCheckoutPrice,
  };
}
