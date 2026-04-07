export interface CheckoutCartItem {
  id: string | number;
  product: { name: string; price: number };
  quantity: number;
}

export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CheckoutFormData {
  name: string;
  whatsapp: string;
  email: string;
  countryCode: string;
}
