import type { CheckoutFormData } from "./checkoutTypes";
import { formatCheckoutPhoneNumber } from "../../api/guestCheckoutApi";
import { parsePlanDurationMinutes } from "../../utils/planDuration";
/** Builds POST body for `/api/payments/create-order` from checkout cart state. */
export function buildCheckoutOrderPayload(
  rawCartItems: unknown[],
  subtotal: number,
  discount: number,
  finalTotal: number,
  couponCode: string,
  data: CheckoutFormData,
) {
  const items = rawCartItems.map((raw) => {
    const item = raw as Record<string, unknown>;
    const product = (item.product as Record<string, unknown>) || {};
    const productVersion = product.version;
    const itemVersion = item.version;
    const versionFromCart =
      (typeof productVersion === "string" && productVersion.trim()) ||
      (typeof itemVersion === "string" && itemVersion.trim()) ||
      null;
    const licenseType = item.licenseType;
    const pricingPlan = item.pricingPlan;
    const subscriptionPlan = (item.subscriptionPlan || item.subscriptionPlanDetails) as
      | { planId?: string; planLabel?: string; planType?: string }
      | undefined;
    const planLabel =
      (typeof subscriptionPlan?.planLabel === "string" && subscriptionPlan.planLabel) ||
      (typeof pricingPlan === "string" && pricingPlan) ||
      (typeof licenseType === "string" && licenseType) ||
      null;
    const planDurationMinutes = parsePlanDurationMinutes(planLabel);
    const productImage =
      (typeof product.image === "string" && product.image) ||
      (typeof product.imageUrl === "string" && product.imageUrl) ||
      (typeof item.image === "string" && item.image) ||
      (typeof item.imageUrl === "string" && item.imageUrl) ||
      null;
    return {
      productId: String(product._id ?? item.productId ?? item._id ?? item.id ?? ""),
      name: (typeof product.name === "string" && product.name) || "Unknown Product",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price ?? product.price ?? item.totalPrice) || 0,
      image: productImage,
      imageUrl: productImage,
      version: versionFromCart,
      pricingPlan: planLabel,
      planDurationLabel: planLabel || undefined,
      planDurationMinutes: planDurationMinutes ?? undefined,
      planType:
        (typeof subscriptionPlan?.planType === "string" && subscriptionPlan.planType) ||
        undefined,
      driveLink: (typeof product.driveLink === "string" && product.driveLink) || null,
    };
  });

  return {
    items,
    subtotal,
    discount,
    shippingCharges: 0,
    totalAmount: finalTotal,
    shippingAddress: {
      fullName: data.name,
      phoneNumber: formatCheckoutPhoneNumber(data.countryCode, data.whatsapp),
      addressLine1: "N/A",
      city: "N/A",
      state: "N/A",
      pincode: "000000",
      country: "India",
    },
    couponCode: couponCode || null,
    notes: `Email: ${data.email}`,
  };
}
