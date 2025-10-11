import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  startDate: Date;
  endDate: Date;
  position: 'Home Page Only' | 'Product Page' | 'Both';
  bannerType: 'Normal' | 'Festival' | 'Flash Sale' | 'Seasonal';
  priority: number;
  status: 'Active' | 'Inactive' | 'Scheduled';
  backgroundColor?: string;
  textColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ctaButtonText: {
      type: String,
      // required: true,
      default: 'Shop Now',
    },
    ctaButtonLink: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    position: {
      type: String,
      enum: ['Home Page Only', 'Product Page', 'Both'],
      default: 'Home Page Only',
      required:true,
    },
    bannerType: {
      type: String,
      enum: ['Normal', 'Festival', 'Flash Sale', 'Seasonal'],
      default: 'Normal',
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Scheduled'],
      default: 'Active',
    },
    backgroundColor: {
      type: String,
      default: '#3B82F6',
    },
    textColor: {
      type: String,
      default: '#FFFFFF',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
BannerSchema.index({ status: 1, priority: -1, startDate: 1, endDate: 1 });

export default mongoose.model<IBanner>('Banner', BannerSchema);