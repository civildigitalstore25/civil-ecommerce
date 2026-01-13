import mongoose, { Document, Schema } from "mongoose";

export interface IBillingAddress extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  whatsapp: string;
  countryCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillingAddressSchema = new Schema<IBillingAddress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    whatsapp: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      default: "+91",
    },
  },
  {
    timestamps: true,
  }
);

// Index to ensure efficient querying by user
BillingAddressSchema.index({ userId: 1, createdAt: -1 });

const BillingAddress = mongoose.model<IBillingAddress>(
  "BillingAddress",
  BillingAddressSchema
);

export default BillingAddress;
