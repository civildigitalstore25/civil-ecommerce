import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  user: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  productName?: string;
  productImage?: string;
  subject: string;
  message: string;
  status: "pending" | "replied" | "closed";
  adminReply?: string;
  repliedBy?: mongoose.Types.ObjectId;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    productName: {
      type: String,
    },
    productImage: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "replied", "closed"],
      default: "pending",
    },
    adminReply: {
      type: String,
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
EnquirySchema.index({ user: 1, createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
