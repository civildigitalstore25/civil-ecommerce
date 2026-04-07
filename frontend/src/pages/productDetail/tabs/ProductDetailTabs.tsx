import type { ReactNode } from "react";
import type { ThemeColors } from "../../../contexts/AdminThemeContext";
import { ProductDetailTabNav } from "./ProductDetailTabNav";
import type { ProductDetailTabKey } from "./tabTypes";

type ProductDetailTabsProps = {
  colors: ThemeColors;
  renderedTabs: ProductDetailTabKey[];
  activeTab: ProductDetailTabKey;
  setActiveTab: (tab: ProductDetailTabKey) => void;
  reviewTotalCount: number;
  children: ReactNode;
};

export function ProductDetailTabs({
  colors,
  renderedTabs,
  activeTab,
  setActiveTab,
  reviewTotalCount,
  children,
}: ProductDetailTabsProps) {
  return (
    <div className="mt-8 lg:mt-16">
      <ProductDetailTabNav
        colors={colors}
        renderedTabs={renderedTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reviewTotalCount={reviewTotalCount}
      />
      <div className="py-4 lg:py-8">{children}</div>
    </div>
  );
}
