import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { saveBillingAddress } from "../../api/billingAddressApi";
import { useCartContext } from "../../contexts/CartContext";
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

export const useCheckoutPayment = (
  rawCartItems: any[],
  summary: CheckoutSummary,
  discount: number,
  couponCode: string,
  normalizePrice: (price: any) => number,
) => {
  const navigate = useNavigate();
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
      const token =
        localStorage.getItem("token") || localStorage.getItem("authToken");

      if (!token) {
        toast.error("Please login to continue");
        setIsProcessing(false);
        navigate("/login");
        return;
      }

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
        const swalResult = await showFreeOrderPlacedSwal(orderId);
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
      toast.error("Failed to process order. Please try again.");
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handlePlaceOrder,
  };
};
