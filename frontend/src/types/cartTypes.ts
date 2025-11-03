export interface CartItem {
  id: string;
  product: Product;
  licenseType: "1year" | "3year" | "lifetime";
  quantity: number;
  price: number;
  totalPrice: number;
  // Optional subscription plan details
  subscriptionPlan?: {
    planId: string;
    planLabel: string;
    planType: string;
  };
}

export interface Product {
  _id?: string;
  name: string;
  version: string;
  description: string;
  category: string;
  company: string;
  price1?: number | undefined;
  price3?: number | undefined;
  priceLifetime?: number | undefined;
  oldPrice1?: number;
  oldPrice3?: number;
  oldPriceLifetime?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
  image: string;
  additionalImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  error: string | null;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RECALCULATE_SUMMARY" };
