import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
  product: Types.ObjectId;
  licenseType: '1year' | '3year' | 'lifetime';
  quantity: number;
  price: number;
  totalPrice: number;
  subscriptionPlan?: {
    planId: string;
    planLabel: string;
    planType: string;
  };
}

export interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  summary: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    itemCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  licenseType: {
    type: String,
    enum: ['1year', '3year', 'lifetime'],
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
  totalPrice: {
    type: Number,
    required: true
  },
  subscriptionPlan: {
    planId: { type: String },
    planLabel: { type: String },
    planType: { type: String }
  }
});

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  summary: {
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    itemCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Calculate summary before saving
cartSchema.pre('save', function (next) {
  const cart = this as ICart;

  const subtotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.18; // 18% GST
  const discount = 0; // Can be implemented later
  const total = subtotal + tax - discount;
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  cart.summary = {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount
  };

  next();
});

export default mongoose.model<ICart>('Cart', cartSchema);