import type { RefObject } from "react";
import type { Product } from "../../../api/types/productTypes";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import type { ReviewStats } from "../../../api/reviewApi";

export type ProductDetailPlanOption = {
  id: string;
  label: string;
  priceINR: number;
  priceUSD: number;
  type?: string;
  trialDays?: number;
  badge?: string | null;
  savings?: string | null;
  isDeal?: boolean;
  originalPriceINR?: number;
  originalPriceUSD?: number;
};

export type FreeOfferSchedule = {
  start: Date;
  end: Date;
  status: "upcoming" | "active" | "ended";
};

export type ProductDetailPurchaseOverviewProps = {
  product: Product;
  colors: ThemeColors;
  reviewStats: ReviewStats | null;
  onShare: (platform: string) => void;
  totalViews: number;
  soldQuantity: number;
};

export type ProductDetailPricingRowBaseProps = {
  colors: ThemeColors;
  selectedBg: string;
  selectedLicense: string;
  onSelectLicense: (id: string) => void;
  formatPriceWithSymbol: (inr: number, usd: number) => string;
};

export type ProductDetailPurchasePricingSectionProps = {
  pricingRef: RefObject<HTMLDivElement | null>;
  colors: ThemeColors;
  selectedBg: string;
  selectedOption: ProductDetailPlanOption | undefined;
  selectedLicense: string;
  onSelectLicense: (id: string) => void;
  licenseOptions: ProductDetailPlanOption[];
  subscriptionOptions: ProductDetailPlanOption[];
  lifetimeOptions: ProductDetailPlanOption[];
  membershipOptions: ProductDetailPlanOption[];
  adminSubscriptionPlans: ProductDetailPlanOption[];
  formatPriceWithSymbol: (inr: number, usd: number) => string;
};

export type ProductDetailPurchaseDealTimersProps = {
  isActiveDeal: boolean;
  product: Product;
  freeOfferSchedule: FreeOfferSchedule | null;
  colors: ThemeColors;
};

export type ProductDetailPurchaseActionsBlockProps = {
  actionRef: RefObject<HTMLDivElement | null>;
  colors: ThemeColors;
  user: { role?: string } | null | undefined;
  onEditClick: () => void;
  isOutOfStock: boolean;
  isActiveFreeProduct: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isInCart: boolean;
  cartQuantity: number;
  onSiteEnquiry: () => void;
};
