import mongoose, { Document, Schema } from 'mongoose';

interface SubscriptionDuration {
  duration: string;
  price: number;
  priceINR?: number;
  priceUSD?: number;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Requirement {
  icon: string;
  title: string;
  description: string;
}

export interface IProduct extends Document {
  name: string;
  version: string;
  shortDescription?: string;
  description: string;
  overallFeatures?: string;
  requirements?: string;
  keyFeatures?: Feature[];
  systemRequirements?: Requirement[];
  category: string;
  company: string; // Will map to brand in frontend
  brand?: string; // New field for brand
  price1: number; // Backward compatibility
  price3?: number; // Backward compatibility
  priceLifetime?: number; // Backward compatibility
  // Dual currency pricing
  price1INR?: number;
  price1USD?: number;
  price3INR?: number;
  price3USD?: number;
  priceLifetimeINR?: number;
  priceLifetimeUSD?: number;
  subscriptionDurations?: SubscriptionDuration[];
  subscriptions?: SubscriptionDuration[]; // Separate field for admin subscription plans
  hasLifetime?: boolean;
  lifetimePrice?: number;
  lifetimePriceINR?: number;
  lifetimePriceUSD?: number;
  hasMembership?: boolean;
  membershipPrice?: number;
  membershipPriceINR?: number;
  membershipPriceUSD?: number;
  image: string; // Will map to imageUrl in frontend
  imageUrl?: string; // New field for main image
  additionalImages?: string[];
  videoUrl?: string;
  activationVideoUrl?: string;
  status?: 'active' | 'inactive' | 'draft';
  isBestSeller?: boolean;
  faqs?: FAQ[];
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionDurationSchema = new Schema({
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  priceINR: { type: Number },
  priceUSD: { type: Number }
}, { _id: false });

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const featureSchema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const requirementSchema = new Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String, required: true },
    overallFeatures: { type: String },
    requirements: { type: String },
    keyFeatures: [featureSchema],
    systemRequirements: [requirementSchema],
    category: { type: String, required: true },
    company: { type: String, required: true }, // Backward compatibility
    brand: { type: String }, // New field
    price1: { type: Number, required: true }, // Backward compatibility
    price3: { type: Number }, // Backward compatibility
    priceLifetime: { type: Number }, // Backward compatibility
    // Dual currency pricing
    price1INR: { type: Number },
    price1USD: { type: Number },
    price3INR: { type: Number },
    price3USD: { type: Number },
    priceLifetimeINR: { type: Number },
    priceLifetimeUSD: { type: Number },
    subscriptionDurations: [subscriptionDurationSchema],
    subscriptions: [subscriptionDurationSchema], // Separate subscription plans for admin use
    hasLifetime: { type: Boolean, default: false },
    lifetimePrice: { type: Number },
    lifetimePriceINR: { type: Number },
    lifetimePriceUSD: { type: Number },
    hasMembership: { type: Boolean, default: false },
    membershipPrice: { type: Number },
    membershipPriceINR: { type: Number },
    membershipPriceUSD: { type: Number },
    image: { type: String, required: true }, // Backward compatibility
    imageUrl: { type: String }, // New field
    additionalImages: [{ type: String }],
    videoUrl: { type: String },
    activationVideoUrl: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active'
    },
    isBestSeller: { type: Boolean, default: false },
    faqs: [faqSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
