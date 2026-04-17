import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../../api/types/productTypes";
import { useRelatedProducts } from "./useRelatedProducts";
import { RelatedProductCard } from "./RelatedProductCard";

interface RelatedProductsProps {
  currentProduct: Product;
  limit?: number;
}

const SCROLL_STEP = 304;

const RelatedProducts = ({ currentProduct, limit: limitProp }: RelatedProductsProps) => {
  const {
    scrollRef,
    navigate,
    addItem,
    colors,
    formatPriceWithSymbol,
    interactiveTint,
    isLoading,
    data,
    related,
    displayList,
    onScroll,
  } = useRelatedProducts(currentProduct, limitProp);

  if (isLoading) return <div>Loading related products...</div>;
  if (!data || !data.products) return null;
  if (related.length === 0) return <div>No related products found.</div>;

  return (
    <div className="relative group/related">
      {displayList.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            el.scrollTo({
              left: Math.max(0, el.scrollLeft - SCROLL_STEP),
              behavior: "smooth",
            });
            onScroll();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-opacity"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            border: `2px solid ${colors.border.primary}`,
          }}
          aria-label="Previous products"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
      >
        {displayList.map((product) => (
          <RelatedProductCard
            key={product._id ?? product.name}
            product={product}
            colors={colors}
            interactiveTint={interactiveTint}
            formatPriceWithSymbol={formatPriceWithSymbol}
            navigate={navigate}
            onAddToCart={(p) => addItem(p, "1year", 1)}
          />
        ))}
      </div>

      {displayList.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const maxScroll = el.scrollWidth - el.clientWidth;
            el.scrollTo({
              left: Math.min(el.scrollLeft + SCROLL_STEP, maxScroll),
              behavior: "smooth",
            });
            onScroll();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/related:opacity-100 transition-opacity"
          style={{
            backgroundColor: colors.background.secondary,
            color: colors.text.primary,
            border: `2px solid ${colors.border.primary}`,
          }}
          aria-label="Next products"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default RelatedProducts;
