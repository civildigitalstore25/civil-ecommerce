import React from "react";
import { useCurrency } from "../../contexts/CurrencyContext";
import { FeaturedProductCard } from "./FeaturedProductCard";
import { useFeaturedProductsSection } from "./useFeaturedProductsSection";

interface FeaturedProductsProps {
  limit?: number;
  showCount?: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  limit = 6,
  showCount = false,
}) => {
  const { formatPriceWithSymbol } = useCurrency();
  const {
    displayedProducts,
    colors,
    interactiveTint,
    badgeTextColor,
    navigate,
    handleAddToCart,
  } = useFeaturedProductsSection(limit);

  if (displayedProducts.length === 0) {
    return null;
  }

  return (
    <div className="transition-colors duration-200 w-full">
      <div className="w-full">
        {showCount && (
          <p
            className="text-sm md:text-lg mb-3 md:mb-4 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {displayedProducts.length} featured product
            {displayedProducts.length !== 1 && "s"}
          </p>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-6">
          {displayedProducts.map((product: any) => (
            <FeaturedProductCard
              key={product._id}
              product={product}
              colors={colors}
              interactiveTint={interactiveTint}
              badgeTextColor={badgeTextColor}
              formatPriceWithSymbol={formatPriceWithSymbol}
              navigate={navigate}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
