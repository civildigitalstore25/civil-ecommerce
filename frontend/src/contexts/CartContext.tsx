import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCart as useCartApi,
  useAddToCart as useAddToCartApi,
  useUpdateCartItem as useUpdateCartItemApi,
  useRemoveFromCart as useRemoveFromCartApi,
  useClearCart as useClearCartApi,
  cartApi,
} from "../api/cartApi";
import { useUser } from "../api/userQueries";
import type { CartItem, CartSummary, Product } from "../types/cartTypes";
import { debounce } from "../utils/debounce";
import { mapCartResponseToContext } from "./cart/mapCartResponseToContext";
import {
  resolveEffectiveLicenseType,
  type CartLicenseType,
} from "./cart/resolveEffectiveLicenseType";
import {
  showCartErrorToast,
  showCartSuccessToast,
} from "./cart/cartMutationToasts";
import {
  loadGuestCart,
  addGuestCartItem,
  removeGuestCartItem,
  updateGuestCartItemQuantity,
  clearGuestCartItems,
  guestCartItemsForMerge,
  clearGuestCartStorage,
} from "./cart/guestCartStorage";

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  addItem: (
    product: Product,
    licenseType: CartLicenseType,
    quantity?: number,
    subscriptionPlan?: { planId: string; planLabel: string; planType: string },
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void> | void;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotalPrice: () => number;
  isItemInCart: (productId: string, licenseType: CartLicenseType) => boolean;
  getItemQuantity: (
    productId: string,
    licenseType: CartLicenseType,
  ) => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [guestCartVersion, setGuestCartVersion] = useState(0);
  const mergedGuestCartRef = useRef(false);
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const isAuthenticated = !!user;

  const { data: cartData, isLoading, error } = useCartApi();
  const addToCartMutation = useAddToCartApi();
  const updateCartItemMutation = useUpdateCartItemApi();
  const removeFromCartMutation = useRemoveFromCartApi();
  const clearCartMutation = useClearCartApi();

  const guestCart = useMemo(() => {
    void guestCartVersion;
    return loadGuestCart();
  }, [guestCartVersion, isAuthenticated]);

  const serverCart = useMemo(
    () => mapCartResponseToContext(cartData),
    [cartData],
  );

  const { items, summary } = isAuthenticated ? serverCart : guestCart;

  const bumpGuestCart = () => setGuestCartVersion((v) => v + 1);

  useEffect(() => {
    if (!isAuthenticated) {
      mergedGuestCartRef.current = false;
      return;
    }

    if (mergedGuestCartRef.current) return;

    const guestItems = loadGuestCart().items;
    if (guestItems.length === 0) {
      mergedGuestCartRef.current = true;
      return;
    }

    mergedGuestCartRef.current = true;
    const mergeItems = guestCartItemsForMerge(guestItems);

    cartApi
      .mergeCart(mergeItems)
      .then(() => {
        clearGuestCartStorage();
        bumpGuestCart();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      })
      .catch((err) => {
        console.error("Failed to merge guest cart:", err);
        mergedGuestCartRef.current = false;
      });
  }, [isAuthenticated]);

  const silentUpdateQuantity = useCallback(
    debounce(async (itemId: string, quantity: number) => {
      try {
        await updateCartItemMutation.mutateAsync({ itemId, quantity });
      } catch (err) {
        console.error("Failed to update item quantity:", err);
        showCartErrorToast("Failed to update cart");
      }
    }, 800),
    [updateCartItemMutation],
  );

  const addItem = async (
    product: Product,
    licenseType: CartLicenseType,
    quantity: number = 1,
    subscriptionPlan?: { planId: string; planLabel: string; planType: string },
  ) => {
    const effectiveLicenseType = resolveEffectiveLicenseType(
      product,
      licenseType,
      subscriptionPlan,
    );

    if (!isAuthenticated) {
      try {
        if (!product._id) {
          showCartErrorToast("Invalid product");
          return;
        }
        addGuestCartItem(product, effectiveLicenseType, quantity, subscriptionPlan);
        bumpGuestCart();
        showCartSuccessToast("Item added to cart!");
        setIsCartOpen(true);
      } catch (err) {
        console.error("Failed to add item to guest cart:", err);
        showCartErrorToast("Failed to add item to cart");
        throw err;
      }
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product._id!,
        licenseType: effectiveLicenseType,
        quantity,
        subscriptionPlan,
      });
      showCartSuccessToast("Item added to cart!");
      setIsCartOpen(true);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      showCartErrorToast("Failed to add item to cart");
      throw err;
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isAuthenticated) {
      removeGuestCartItem(itemId);
      bumpGuestCart();
      showCartSuccessToast("Item removed from cart");
      return;
    }

    try {
      await removeFromCartMutation.mutateAsync(itemId);
      showCartSuccessToast("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
      showCartErrorToast("Failed to remove item from cart");
      throw err;
    }
  };

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (!isAuthenticated) {
        updateGuestCartItemQuantity(itemId, quantity);
        bumpGuestCart();
        return;
      }
      silentUpdateQuantity(itemId, quantity);
    },
    [isAuthenticated, silentUpdateQuantity],
  );

  const clearCart = async () => {
    if (!isAuthenticated) {
      clearGuestCartItems();
      bumpGuestCart();
      showCartSuccessToast("Cart cleared");
      return;
    }

    try {
      await clearCartMutation.mutateAsync();
      showCartSuccessToast("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      showCartErrorToast("Failed to clear cart");
      throw err;
    }
  };

  const getItemCount = () => summary.itemCount;
  const getTotalPrice = () => summary.total;

  const isItemInCart = (
    productId: string,
    licenseType: CartLicenseType,
  ) => {
    return items.some(
      (item) =>
        item.product._id === productId && item.licenseType === licenseType,
    );
  };

  const getItemQuantity = (
    productId: string,
    licenseType: CartLicenseType,
  ) => {
    const item = items.find(
      (item) =>
        item.product._id === productId && item.licenseType === licenseType,
    );
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    summary,
    isLoading: isAuthenticated
      ? isLoading ||
        addToCartMutation.isPending ||
        removeFromCartMutation.isPending ||
        clearCartMutation.isPending
      : false,
    error: isAuthenticated
      ? error?.message ||
        addToCartMutation.error?.message ||
        removeFromCartMutation.error?.message ||
        clearCartMutation.error?.message ||
        null
      : null,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    isItemInCart,
    getItemQuantity,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
