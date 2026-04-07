import { useRef, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import type { CartItem as CartItemType } from "../../types/cartTypes";

interface UseCartItemQuantityDomParams {
  item: CartItemType;
  formatPriceWithSymbol: (amount: number) => string;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function useCartItemQuantityDom({
  item,
  formatPriceWithSymbol,
  onUpdateQuantity,
}: UseCartItemQuantityDomParams) {
  const quantityDisplayRef = useRef<HTMLSpanElement>(null);
  const totalPriceRef = useRef<HTMLDivElement>(null);
  const decreaseButtonRef = useRef<HTMLButtonElement>(null);
  const currentQuantityRef = useRef(item.quantity);

  useEffect(() => {
    currentQuantityRef.current = item.quantity;
    if (quantityDisplayRef.current) {
      quantityDisplayRef.current.textContent = item.quantity.toString();
    }
    if (totalPriceRef.current) {
      totalPriceRef.current.textContent = formatPriceWithSymbol(
        item.totalPrice,
      );
    }
    if (decreaseButtonRef.current) {
      decreaseButtonRef.current.disabled = item.quantity <= 1;
    }
  }, [item.quantity, item.totalPrice, formatPriceWithSymbol]);

  const updateUIDirectly = useCallback(
    (newQuantity: number) => {
      const newTotalPrice = newQuantity * item.price;

      if (quantityDisplayRef.current) {
        quantityDisplayRef.current.textContent = newQuantity.toString();
      }

      if (totalPriceRef.current) {
        totalPriceRef.current.textContent =
          formatPriceWithSymbol(newTotalPrice);
      }

      if (decreaseButtonRef.current) {
        decreaseButtonRef.current.disabled = newQuantity <= 1;
      }

      currentQuantityRef.current = newQuantity;
    },
    [item.price, formatPriceWithSymbol],
  );

  const handleQuantityChange = useCallback(
    async (newQuantity: number) => {
      if (newQuantity < 1) return;

      if (newQuantity > 10) {
        Swal.fire(
          "Maximum Quantity",
          "You can only add up to 10 of this item",
          "warning",
        );
        return;
      }

      updateUIDirectly(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    },
    [item.id, onUpdateQuantity, updateUIDirectly],
  );

  const handleIncrease = useCallback(() => {
    handleQuantityChange(currentQuantityRef.current + 1);
  }, [handleQuantityChange]);

  const handleDecrease = useCallback(() => {
    handleQuantityChange(currentQuantityRef.current - 1);
  }, [handleQuantityChange]);

  return {
    quantityDisplayRef,
    totalPriceRef,
    decreaseButtonRef,
    handleIncrease,
    handleDecrease,
  };
}
