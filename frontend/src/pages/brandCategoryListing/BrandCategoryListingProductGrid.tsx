import type { Product } from "../../api/types/productTypes";
import type { ThemeColors } from "../../contexts/AdminThemeContext";
import { BrandCategoryListingProductCard } from "./BrandCategoryListingProductCard";

interface BrandCategoryListingProductGridProps {
  products: Product[];
  colors: ThemeColors;
  interactiveTint: string;
  formatPriceWithSymbol: (inr: number, usd?: number) => string;
  onNavigateProduct: (slug: string) => void;
  onAddToCart: (product: Product) => void;
}

export function BrandCategoryListingProductGrid({
  products,
  colors,
  interactiveTint,
  formatPriceWithSymbol,
  onNavigateProduct,
  onAddToCart,
}: BrandCategoryListingProductGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
      {products.map((product) => (
        <BrandCategoryListingProductCard
          key={product._id}
          product={product}
          colors={colors}
          interactiveTint={interactiveTint}
          formatPriceWithSymbol={formatPriceWithSymbol}
          onNavigateProduct={onNavigateProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
