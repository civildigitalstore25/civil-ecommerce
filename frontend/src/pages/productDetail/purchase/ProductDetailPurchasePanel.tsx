import React from "react";
import type {
  ProductDetailPurchaseActionsBlockProps,
  ProductDetailPurchaseDealTimersProps,
  ProductDetailPurchaseOverviewProps,
  ProductDetailPurchasePricingSectionProps,
} from "./types";
import { ProductDetailPurchaseActionsBlock } from "./ProductDetailPurchaseActionsBlock";
import { ProductDetailPurchaseDealTimers } from "./ProductDetailPurchaseDealTimers";
import { ProductDetailPurchaseOverview } from "./ProductDetailPurchaseOverview";
import { ProductDetailPurchasePricingSection } from "./ProductDetailPurchasePricingSection";

export type ProductDetailPurchasePanelProps = {
  overview: ProductDetailPurchaseOverviewProps;
  pricing: ProductDetailPurchasePricingSectionProps;
  dealTimers: ProductDetailPurchaseDealTimersProps;
  actions: ProductDetailPurchaseActionsBlockProps;
};

export const ProductDetailPurchasePanel: React.FC<ProductDetailPurchasePanelProps> = ({
  overview,
  pricing,
  dealTimers,
  actions,
}) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <ProductDetailPurchaseOverview {...overview} />
      <ProductDetailPurchasePricingSection {...pricing} />
      <ProductDetailPurchaseDealTimers {...dealTimers} />
      <ProductDetailPurchaseActionsBlock {...actions} />
    </div>
  );
};
