import type { CheckoutFormData } from "./checkoutTypes";

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
    return {
      productId: String(item._id ?? item.id ?? product._id ?? ""),
      name: (typeof product.name === "string" && product.name) || "Unknown Product",
      quantity: Number(item.quantity) || 1,
      price: Number(item.price ?? product.price ?? item.totalPrice) || 0,
      image: (typeof product.image === "string" && product.image) || null,
      version: versionFromCart,
      pricingPlan:
        (typeof licenseType === "string" && licenseType) ||
        (typeof pricingPlan === "string" && pricingPlan) ||
        null,
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
}
