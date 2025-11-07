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
  orderId: string;
  orderNumber: number;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCharges: number;
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data: IOrder[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
  };
  message?: string;
}

export interface OrderDetailResponse {
  success: boolean;
  data: IOrder;
  message?: string;
}
