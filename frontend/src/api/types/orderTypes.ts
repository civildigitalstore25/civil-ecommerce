export interface IShippingAddress {
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  orderNumber: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'CREATED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentId?: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: IOrder[];
  message?: string;
}

export interface OrderDetailResponse {
  success: boolean;
  data: IOrder;
  message?: string;
}

