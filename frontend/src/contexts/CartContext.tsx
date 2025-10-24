import React, { createContext, useContext, useCallback } from 'react';
// Custom debounce implementation - no lodash dependency
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
import {
  useCart as useCartApi,
  useAddToCart as useAddToCartApi,
  useUpdateCartItem as useUpdateCartItemApi,
  useRemoveFromCart as useRemoveFromCartApi,
  useClearCart as useClearCartApi
} from '../api/cartApi';
import { useUser } from '../api/userQueries';
import type { CartItem, CartSummary, Product } from '../types/cartTypes';
import Swal from 'sweetalert2';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, licenseType: '1year' | '3year' | 'lifetime', quantity?: number, subscriptionPlan?: { planId: string; planLabel: string; planType: string; }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
  isItemInCart: (productId: string, licenseType: '1year' | '3year' | 'lifetime') => boolean;
  getItemQuantity: (productId: string, licenseType: '1year' | '3year' | 'lifetime') => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user } = useUser();
  const { data: cartData, isLoading, error } = useCartApi();
  const addToCartMutation = useAddToCartApi();
  const updateCartItemMutation = useUpdateCartItemApi();
  const removeFromCartMutation = useRemoveFromCartApi();
  const clearCartMutation = useClearCartApi();

  // Silent update - no toast notifications for quantity updates
  const silentUpdateQuantity = useCallback(
    debounce(async (itemId: string, quantity: number) => {
      try {
        await updateCartItemMutation.mutateAsync({ itemId, quantity });
        // No success toast for silent updates
      } catch (error) {
        console.error('Failed to update item quantity:', error);
        // Only show error toasts
        Swal.fire({
          icon: 'error',
          title: 'Failed to update cart',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }, 800), // Slightly longer debounce for less frequent API calls
    [updateCartItemMutation]
  );

  const showSuccessToast = (message: string) => {
    Swal.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const showErrorToast = (message: string) => {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const items: CartItem[] = cartData?.items.map(item => ({
    id: item._id,
    product: item.product,
    licenseType: item.licenseType,
    quantity: item.quantity,
    price: item.price,
    totalPrice: item.totalPrice,
    subscriptionPlan: (item as any).subscriptionPlan
  })) || [];

  const summary: CartSummary = cartData?.summary || {
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    itemCount: 0
  };

  const addItem = async (product: Product, licenseType: '1year' | '3year' | 'lifetime', quantity: number = 1, subscriptionPlan?: { planId: string; planLabel: string; planType: string; }) => {
    if (!user) {
      showErrorToast('Please login to add items to cart');
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        productId: product._id!,
        licenseType,
        quantity,
        subscriptionPlan
      });
      showSuccessToast('Item added to cart!');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      showErrorToast('Failed to add item to cart');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeFromCartMutation.mutateAsync(itemId);
      showSuccessToast('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      showErrorToast('Failed to remove item from cart');
    }
  };

  // This is the key - silent quantity update with no UI feedback
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    silentUpdateQuantity(itemId, quantity);
  }, [silentUpdateQuantity]);

  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      showSuccessToast('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      showErrorToast('Failed to clear cart');
    }
  };

  const getItemCount = () => summary.itemCount;
  const getTotalPrice = () => summary.total;

  const isItemInCart = (productId: string, licenseType: '1year' | '3year' | 'lifetime') => {
    return items.some(
      item => item.product._id === productId && item.licenseType === licenseType
    );
  };

  const getItemQuantity = (productId: string, licenseType: '1year' | '3year' | 'lifetime') => {
    const item = items.find(
      item => item.product._id === productId && item.licenseType === licenseType
    );
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    summary,
    isLoading: isLoading || addToCartMutation.isPending || removeFromCartMutation.isPending || clearCartMutation.isPending,
    error: error?.message || addToCartMutation.error?.message || removeFromCartMutation.error?.message || clearCartMutation.error?.message || null,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getTotalPrice,
    isItemInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};