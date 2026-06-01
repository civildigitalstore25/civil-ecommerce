import mongoose, { Schema, Document } from "mongoose";

export interface IBackInStockAlert extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  productSlug?: string;
  name: string;
  email: string;
  notified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BackInStockAlertSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    productSlug: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

BackInStockAlertSchema.index({ product: 1, email: 1 }, { unique: true });
BackInStockAlertSchema.index({ product: 1, notified: 1, createdAt: -1 });

export default mongoose.model<IBackInStockAlert>(
  "BackInStockAlert",
  BackInStockAlertSchema,
);
