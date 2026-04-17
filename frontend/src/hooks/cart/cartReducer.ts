import type {
  CartState,
  CartItem,
  CartSummary,
  CartAction,
} from "../../types/cartTypes";

function calculateSummary(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discount = 0;
  const total = subtotal - discount;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
}

export const initialCartState: CartState = {
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

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product._id === action.payload.product._id &&
          item.licenseType === action.payload.licenseType,
      );

      let newItems;
      if (existingItemIndex >= 0) {
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
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        summary: calculateSummary(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload,
      );
      return {
        ...state,
        items: filteredItems,
        summary: calculateSummary(filteredItems),
      };
    }

    case "UPDATE_QUANTITY": {
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
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        items: updatedItems,
        summary: calculateSummary(updatedItems),
      };
    }

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
