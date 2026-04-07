import type { CartResponse } from "../../api/cartApi";
import type { CartItem, CartSummary } from "../../types/cartTypes";

const emptySummary: CartSummary = {
  subtotal: 0,
  discount: 0,
  total: 0,
  itemCount: 0,
};

export function mapCartResponseToContext(
  cartData: CartResponse | undefined,
): { items: CartItem[]; summary: CartSummary } {
  if (!cartData) {
    return { items: [], summary: emptySummary };
  }

  const items: CartItem[] = cartData.items.map((item) => {
    const row = item as CartItem & {
      _id: string;
      subscriptionPlan?: CartItem["subscriptionPlan"];
    };
    return {
      id: row._id,
      product: row.product,
      licenseType: row.licenseType,
      quantity: row.quantity,
      price: row.price,
      totalPrice: row.totalPrice,
      subscriptionPlan: row.subscriptionPlan,
    };
  });

  return {
    items,
    summary: cartData.summary ?? emptySummary,
  };
}
