import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  name: string;
  description?: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  validFrom: Date;
  validTo: Date;
  status: 'Active' | 'Inactive';
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['Percentage', 'Fixed'], required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model<ICoupon>('Coupon', couponSchema);
