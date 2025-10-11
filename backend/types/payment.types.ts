import { Document, Types } from 'mongoose';

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

export interface IOrder extends Document {
  _id: Types.ObjectId;
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
  paymentId?: Types.ObjectId;
  couponCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment extends Document {
  _id: Types.ObjectId;
  userId: string;
  orderId?: Types.ObjectId;
  merchantTransactionId: string;
  transactionId?: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
  providerReferenceId?: string;
  responseCode?: string;
  responseMessage?: string;
  paymentInstrument?: any;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhonePePaymentRequest {
  merchantTransactionId: string;
  merchantUserId: string;
  amount: number;
  mobileNumber?: string;
  redirectUrl: string;
  redirectMode: string;
  callbackUrl: string;
  paymentInstrument: {
    type: string;
  };
}

export interface PhonePeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId?: string;
    merchantTransactionId?: string;
    transactionId?: string;
    amount?: number;
    state?: string;
    responseCode?: string;
    paymentInstrument?: any;
    instrumentResponse?: {
      redirectInfo?: {
        url: string;
        method: string;
      };
    };
  };
}

export interface CreateOrderRequest {
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  discount?: number;
  shippingCharges?: number;
  tax?: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
}