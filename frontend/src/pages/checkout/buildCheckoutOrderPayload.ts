import type { CheckoutFormData } from "./checkoutTypes";

/** Builds POST body for `/api/payments/create-order` from checkout cart state. */
export function buildCheckoutOrderPayload(
  rawCartItems: any[],
  subtotal: number,
  discount: number,
  finalTotal: number,
  couponCode: string,
  data: CheckoutFormData,
) {
  const items = rawCartItems.map((item) => ({
    productId: (item._id || item.id || item.product?._id).toString(),
    name: item.product?.name || "Unknown Product",
    quantity: item.quantity,
    price:
      Number(item.price || item.product?.price || item.totalPrice) || 0,
    image: item.product?.image || null,
    version: item.product?.version || null,
    pricingPlan: item.licenseType || null,
    driveLink: item.product?.driveLink || null,
  }));

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
