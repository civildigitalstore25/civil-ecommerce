import { 
  showCouponSuccess, 
  showCouponError, 
  showCouponMissingError, 
  showCouponConnectionError 
} from "./checkoutCouponDialogs";

export const useCheckoutCoupon = (
  couponCode: string,
  setCouponCode: (code: string) => void,
  setDiscount: (discount: number) => void,
  summary: { subtotal: number },
  rawCartItems: any[],
  normalizePrice: (price: any) => number
) => {
  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      showCouponMissingError();
      return;
    }

    const subtotal = normalizePrice(summary.subtotal);

    const productIds: string[] = rawCartItems
      .map((item: any) => (item.product?._id || item.product?.id || item._id)?.toString())
      .filter(Boolean);
    const items: { productId: string; subtotal: number }[] = rawCartItems.map((item: any) => {
      const pid = (item.product?._id || item.product?.id || item._id)?.toString();
      const lineSubtotal = normalizePrice(
        Number(item.totalPrice ?? (item.price ?? item.product?.price ?? 0) * (item.quantity ?? 1))
      );
      return { productId: pid, subtotal: lineSubtotal };
    }).filter((i: { productId: string; subtotal: number }) => i.productId);

    try {
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
            productIds,
            items,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Invalid coupon code";
        showCouponError(errorMessage, code);
        return;
      }

      if (data.success) {
        const discountAmount = data.coupon.discountAmount;
        setDiscount(discountAmount);
        setCouponCode(code);
        showCouponSuccess(data.coupon, discountAmount);
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      showCouponConnectionError(() => applyCoupon());
    }
  };

  return { applyCoupon };
};
