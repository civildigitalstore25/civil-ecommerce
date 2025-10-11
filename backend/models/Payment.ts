import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types/payment.types';

const paymentSchema = new Schema<IPayment>({
  userId: {
    type: String,  // Changed from Schema.Types.ObjectId to String
    required: true,
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: false,
    default: null
  },
  merchantTransactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  transactionId: {
    type: String,
    default: null,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING',
    index: true
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'CARD', 'NET_BANKING', 'WALLET'],
    default: null
  },
  providerReferenceId: {
    type: String,
    default: null
  },
  responseCode: {
    type: String,
    default: null
  },
  responseMessage: {
    type: String,
    default: null
  },
  paymentInstrument: {
    type: Schema.Types.Mixed,
    default: null
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for faster queries
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;