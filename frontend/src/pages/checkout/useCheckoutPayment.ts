import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { saveBillingAddress } from "../../api/billingAddressApi";
import {
  guestCheckoutAuth,
  GuestCheckoutAccountExistsError,
  formatCheckoutPhoneNumber,
} from "../../api/guestCheckoutApi";
import { useCartContext } from "../../contexts/CartContext";
import { saveAuth } from "../../utils/auth";
import type { CheckoutFormData, CheckoutSummary } from "./checkoutTypes";
import { buildCheckoutOrderPayload } from "./buildCheckoutOrderPayload";
import { loadCashfreeScript } from "./loadCashfreeScript";
import {
  postPaymentsCreateOrder,
  postPaymentsFailed,
  postPaymentsVerify,
} from "./checkoutPaymentApi";
import {
  navigateAfterCheckoutSuccessSwal,
  showFreeOrderPlacedSwal,
  showPaidOrderSuccessSwal,
} from "./checkoutSuccessSwal";

async function resolveCheckoutToken(
  data: CheckoutFormData,
  navigate: ReturnType<typeof useNavigate>,
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<{ token: string; isNewGuest: boolean } | null> {
  const existingToken =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  if (existingToken) {
    return { token: existingToken, isNewGuest: false };
  }

  try {
    const guestResult = await guestCheckoutAuth({
      email: data.email.trim(),
      fullName: data.name.trim(),
      phoneNumber: formatCheckoutPhoneNumber(data.countryCode, data.whatsapp),
    });

    saveAuth({
      token: guestResult.token,
      email: guestResult.user.email,
      role: guestResult.user.role,
      userId: guestResult.user.id,
      fullName: guestResult.user.fullName,
    });

    queryClient.setQueryData(["currentUser"], guestResult.user);
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.invalidateQueries({ queryKey: ["cart"] });

    return { token: guestResult.token, isNewGuest: guestResult.isNewGuest };
  } catch (error) {
    if (error instanceof GuestCheckoutAccountExistsError) {
      const result = await Swal.fire({
        icon: "info",
        title: "Account already exists",
        text: error.message,
        showCancelButton: true,
        confirmButtonText: "Sign in",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        navigate("/signin", { state: { returnTo: "/checkout" } });
      }
      return null;
    }
    throw error;
  }
}

export const useCheckoutPayment = (
  rawCartItems: any[],
  summary: CheckoutSummary,
  discount: number,
  couponCode: string,
  normalizePrice: (price: any) => number,
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearCart } = useCartContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async (data: CheckoutFormData) => {
    if (rawCartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const authResult = await resolveCheckoutToken(data, navigate, queryClient);
      if (!authResult) {
        setIsProcessing(false);
        return;
      }

      const { token, isNewGuest } = authResult;
      const subtotal = normalizePrice(summary.subtotal);
      const finalTotal = subtotal - discount;

      try {
        await saveBillingAddress({
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          countryCode: data.countryCode,
        });
      } catch (error) {
        console.error("Failed to save billing address:", error);
      }

      const orderData = buildCheckoutOrderPayload(
        rawCartItems,
        subtotal,
        discount,
        finalTotal,
        couponCode,
        data,
      );

      const responseData = (await postPaymentsCreateOrder(
        token,
        orderData,
      )) as {
        success?: boolean;
        message?: string;
        data?: {
          orderId?: string;
          isFreeOrder?: boolean;
          paymentSessionId?: string;
          environment?: string;
        };
      };

      if (!responseData.success) {
        toast.error(responseData.message || "Failed to create order");
        setIsProcessing(false);
        return;
      }

      const isFreeOrder = responseData.data?.isFreeOrder || finalTotal <= 0;
      if (isFreeOrder) {
        try {
          await clearCart();
        } catch (error) {
          console.error("Failed to clear cart:", error);
        }
        const orderId = responseData.data?.orderId ?? "";
        const swalResult = await showFreeOrderPlacedSwal(orderId, isNewGuest);
        navigateAfterCheckoutSuccessSwal(swalResult, navigate);
        setIsProcessing(false);
        return;
      }

      const scriptLoaded = await loadCashfreeScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setIsProcessing(false);
        return;
      }

      const cashfree = await (window as any).Cashfree({
        mode: responseData.data?.environment || "sandbox",
      });

      const checkoutOptions = {
        paymentSessionId: responseData.data?.paymentSessionId,
        redirectTarget: "_self",
        returnUrl: `${window.location.origin}/payment-status?order_id=${responseData.data?.orderId}`,
      };

      cashfree
        .checkout(checkoutOptions)
        .then(async (result: any) => {
          if (result.error) {
            console.error("Payment error:", result.error);
            toast.error(result.error.message || "Payment failed");
            setIsProcessing(false);

            await postPaymentsFailed(token, {
              orderId: responseData.data?.orderId,
              error: result.error,
            });
            return;
          }

          if (result.redirect) {
            return;
          }

          if (result.paymentDetails) {
            try {
              const verifyData = (await postPaymentsVerify(token, {
                orderId: responseData.data?.orderId,
              })) as { success?: boolean };

              if (verifyData.success) {
                try {
                  await clearCart();
                } catch (error) {
                  console.error("Failed to clear cart:", error);
                }

                const orderId = responseData.data?.orderId ?? "";
                const swalResult = await showPaidOrderSuccessSwal(
                  orderId,
                  finalTotal,
                  isNewGuest,
                );
                navigateAfterCheckoutSuccessSwal(swalResult, navigate);
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
        })
        .catch((error: any) => {
          console.error("Cashfree checkout error:", error);
          toast.error("Payment process failed. Please try again.");
          setIsProcessing(false);
        });
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to process order. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handlePlaceOrder,
  };
};
