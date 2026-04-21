import type { IOrderItem } from "../../../api/types/orderTypes";

export function lineGross(item: Pick<IOrderItem, "price" | "quantity">): number {
  return Math.max(0, Number(item.price) || 0) * Math.max(1, Number(item.quantity) || 1);
}

/** Rupee discount applied to this line (capped at line gross). */
export function lineDiscountApplied(item: IOrderItem): number {
  const g = lineGross(item);
  return Math.min(Math.max(0, Number(item.discount) || 0), g);
}

export function sumItemsGross(items: IOrderItem[]): number {
  return items.reduce((s, i) => s + lineGross(i), 0);
}

export function sumLineDiscounts(items: IOrderItem[]): number {
  return items.reduce((s, i) => s + lineDiscountApplied(i), 0);
}

export function orderSubtotalAfterLineDiscounts(items: IOrderItem[]): number {
  return Math.max(0, sumItemsGross(items) - sumLineDiscounts(items));
}

export function orderTotalAfterDiscounts(items: IOrderItem[], orderDiscount: number | undefined): number {
  const sub = orderSubtotalAfterLineDiscounts(items);
  const d = Math.max(0, Number(orderDiscount) || 0);
  return Math.max(0, sub - d);
}
