export interface SubscriptionDuration {
  duration: string;
  price: number;
  priceINR?: number;
  priceUSD?: number;
  trialDays?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Requirement {
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  _id?: string;
  name: string;
  version: string;
  shortDescription?: string;
  description: string;
  detailsDescription?: string;
  overallFeatures?: string;
  requirements?: string;
  keyFeatures?: Feature[];
  systemRequirements?: Requirement[];
  category: string;
  company: string; // Backward compatibility
  brand?: string; // New field
  price1?: number | undefined; // Backward compatibility
  price2?: number | undefined; // Backward compatibility
  price3?: number | undefined; // Backward compatibility
  priceLifetime?: number | undefined; // Backward compatibility
  // Dual currency pricing
  price1INR?: number;
  price1USD?: number;
  price2INR?: number;
  price2USD?: number;
  price3INR?: number;
  price3USD?: number;
  priceLifetimeINR?: number;
  priceLifetimeUSD?: number;
  subscriptionDurations?: SubscriptionDuration[];
  subscriptions?: SubscriptionDuration[]; // Separate subscription plans for admin use
  hasLifetime?: boolean;
  lifetimePrice?: number;
  lifetimePriceINR?: number;
  lifetimePriceUSD?: number;
  hasMembership?: boolean;
  membershipPrice?: number;
  membershipPriceINR?: number;
  membershipPriceUSD?: number;
  oldPrice1?: number;
  oldPrice2?: number;
  oldPrice3?: number;
  oldPriceLifetime?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
  image: string; // Backward compatibility
  imageUrl?: string; // New field
  additionalImages?: string[];
  videoUrl?: string;
  activationVideoUrl?: string;
  driveLink?: string; // Google Drive download link
  status?: "active" | "inactive" | "draft";
  isBestSeller?: boolean;
  isOutOfStock?: boolean;
  faqs?: FAQ[];
  createdAt?: string;
  updatedAt?: string;
}
