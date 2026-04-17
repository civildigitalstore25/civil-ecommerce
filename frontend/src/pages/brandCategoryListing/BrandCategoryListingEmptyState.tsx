import React from "react";
import { Package } from "lucide-react";

type Props = {
  colors: any;
  searchTerm: string;
  onBackHome: () => void;
};

export const BrandCategoryListingEmptyState: React.FC<Props> = ({
  colors,
  searchTerm,
  onBackHome,
}) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Package
      className="w-24 h-24 mb-4"
      style={{ color: colors.text.secondary }}
    />
    <h3
      className="text-2xl font-semibold mb-2"
      style={{ color: colors.text.primary }}
    >
      No Products Found
    </h3>
    <p
      className="text-lg mb-6"
      style={{ color: colors.text.secondary }}
    >
      {searchTerm
        ? `No products matched "${searchTerm}".`
        : "We couldn't find any products in this category."}
    </p>
    <button
      type="button"
      onClick={onBackHome}
      className="px-6 py-3 rounded-lg transition-colors font-medium"
      style={{
        backgroundColor: colors.interactive.primary,
        color: colors.background.primary,
      }}
    >
      Back to Home
    </button>
  </div>
);
