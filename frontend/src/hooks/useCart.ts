import { useEffect, useReducer } from "react";
import type { CartItem, Product } from "../types/cartTypes";
import { cartReducer, initialCartState } from "./cart/cartReducer";
import { generateCartItemId, getPriceByLicenseType } from "./cart/cartUtils";

export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          dispatch({ type: "SET_LOADING", payload: true });

          dispatch({ type: "CLEAR_CART" });
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({ type: "ADD_ITEM", payload: item });
          });

          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify({
          items: state.items,
          summary: state.summary,
        }),
      );
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to save cart" });
    }
  }, [state.items, state.summary]);

  const addItem = (
    product: Product,
    licenseType: "1year" | "3year" | "lifetime",
    quantity: number = 1,
  ) => {
    const price = getPriceByLicenseType(product, licenseType);
    if (price <= 0) {
      dispatch({
        type: "SET_ERROR",
        payload: "Invalid price for selected license",
      });
      return;
    }

    const cartItem: CartItem = {
      id: generateCartItemId(),
      product,
      licenseType,
      quantity,
      price,
      totalPrice: price * quantity,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getItemCount = () => {
    return state.summary.itemCount;
  };

  const getTotalPrice = () => {
    return state.summary.total;
  };

  const isItemInCart = (
    productId: string,
    licenseType: "1year" | "3year" | "lifetime",
  ) => {
    return state.items.some(
      (item) =>
        item.product._id === productId && item.licenseType === licenseType,
    );
  };

  const getItemQuantity = (
    productId: string,
    licenseType: "1year" | "3year" | "lifetime",
  ) => {
    const item = state.items.find(
      (item) =>
        item.product._id === productId && item.licenseType === licenseType,
    );
    return item ? item.quantity : 0;
  };

  return {
    items: state.items,
    summary: state.summary,
    isLoading: state.isLoading,
    error: state.error,

    addItem,
    removeItem,
    updateQuantity,
    clearCart,

    getItemCount,
    getTotalPrice,
    isItemInCart,
    getItemQuantity,
  };
};
