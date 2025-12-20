import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  version?: string;
  pricingPlan?: string;
  driveLink?: string; // Google Drive download link
}

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

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  orderId: string;
  orderNumber: number; // Sequential order number (required)
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shippingCharges: number;
  totalAmount: number;
  shippingAddress: IShippingAddress;
  couponCode?: string;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  phonepeTransactionId?: string;
  phonepePaymentId?: string;
  paymentGateway?: 'razorpay' | 'phonepe';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderNumber: {
    type: Number,
    required: true,
    unique: true
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    version: { type: String },
    pricingPlan: { type: String },
    driveLink: { type: String } // Google Drive download link
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    addressLine1: { type: String, required: false },
    addressLine2: { type: String },
    city: { type: String, required: false },
    state: { type: String, required: false },
    pincode: { type: String, required: false },
    country: { type: String, required: false, default: 'India' }
  },
  couponCode: {
    type: String
  },
  notes: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  phonepeTransactionId: {
    type: String
  },
  phonepePaymentId: {
    type: String
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'phonepe'],
    default: 'razorpay'
  }
}, {
  timestamps: true
});

// Index for faster queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ razorpayOrderId: 1 });
OrderSchema.index({ phonepeTransactionId: 1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;