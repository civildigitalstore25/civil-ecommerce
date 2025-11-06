import { useEffect, useReducer } from "react";
import type {
  CartState,
  CartItem,
  CartSummary,
  CartAction,
  Product,
} from "../types/cartTypes";

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product._id === action.payload.product._id &&
          item.licenseType === action.payload.licenseType,
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + action.payload.quantity,
                totalPrice:
                  (item.quantity + action.payload.quantity) * item.price,
              }
            : item,
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems),
      };

    case "REMOVE_ITEM":
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload,
      );
      return {
        ...state,
        items: filteredItems,
        summary: calculateSummary(filteredItems),
      };

    case "UPDATE_QUANTITY":
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
                totalPrice: action.payload.quantity * item.price,
              }
            : item,
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        summary: {
          subtotal: 0,
          discount: 0,
          total: 0,
          itemCount: 0,
        },
      };

    case "RECALCULATE_SUMMARY":
      return {
        ...state,
        summary: calculateSummary(state.items),
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Calculate cart summary
const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = 0; // Can be implemented later with coupon codes
  const total = subtotal - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
};

// Generate unique cart item ID
const generateCartItemId = (): string => {
  return `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get price based on license type
const getPriceByLicenseType = (
  product: Product,
  licenseType: "1year" | "3year" | "lifetime",
): number => {
  switch (licenseType) {
    case "1year":
      return product.price1 || 0;
    case "3year":
      return product.price3 || 0;
    case "lifetime":
      return product.priceLifetime || 0;
    default:
      return product.price1 || 0;
  }
};

// Initial cart state
const initialCartState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
  },
  isLoading: false,
  error: null,
};

// Custom hook for cart management
export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          // Restore cart items and recalculate summary
          dispatch({ type: "SET_LOADING", payload: true });

          // Force summary recalculation
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

  // Save cart to localStorage whenever items change
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

  // Cart actions
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
    // State
    items: state.items,
    summary: state.summary,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,

    // Utilities
    getItemCount,
    getTotalPrice,
    isItemInCart,
    getItemQuantity,
  };
};
