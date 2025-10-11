import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, IOrderItem, IShippingAddress } from '../types/payment.types';

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: null
  }
});

const shippingAddressSchema = new Schema<IShippingAddress>({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String,
    default: null
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  }
});

const orderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  shippingCharges: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },
  orderStatus: {
    type: String,
    enum: ['CREATED', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'CREATED'
  },
  paymentId: {
    type: String,
    default: null
  },
  couponCode: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Generate order number before validation
orderSchema.pre('validate', async function(next) {
  if (!this.orderNumber) {
    try {
      // Get count of all orders
      const count = await mongoose.model('Order').countDocuments();
      const timestamp = Date.now();
      const paddedCount = (count + 1).toString().padStart(4, '0');
      this.orderNumber = `ORD${timestamp}${paddedCount}`;
    } catch (error) {
      // Fallback if counting fails
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      this.orderNumber = `ORD${timestamp}${random}`;
    }
  }
  next();
});

// Indexes
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;