import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useLatestProducts } from "../../api/productApi";
import type { Product } from "../../api/types/productTypes";
import { productSlugFromProduct } from "../../utils/productSlugFromProduct";
import { ProductCarouselFromPriceOverlay } from "./ProductCarouselFromPriceOverlay";

const sectionGradient = (primary: string, secondary: string) =>
  `linear-gradient(120deg, ${primary} 60%, ${secondary} 100%)`;

const LatestArrivalsCarousel: React.FC = () => {
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();
  const navigate = useNavigate();
  const { data, isLoading } = useLatestProducts(10);
  const products = (data?.products ?? []) as Product[];

  const allProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products];
  }, [products]);

  if (isLoading) {
    return (
      <section
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: sectionGradient(colors.background.primary, colors.background.secondary),
        }}
      >
        <div className="text-center px-4">
          <div style={{ color: colors.text.secondary }}>Loading latest arrivals...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id="latest-arrivals-section"
      className="w-full py-16 transition-colors duration-200 overflow-hidden"
      style={{
        background: sectionGradient(colors.background.primary, colors.background.secondary),
      }}
    >
      <style>{`
        @keyframes scroll-latest-arrivals {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-latest-arrivals {
          animation: scroll-latest-arrivals ${products.length * 4}s linear infinite;
          will-change: transform;
        }
        .latest-arrivals-track:hover .animate-scroll-latest-arrivals {
          animation-play-state: paused;
        }
      `}</style>

      <div className="text-center mb-8 md:mb-12 px-4">
        <h2
          className="text-2xl md:text-4xl font-poppins font-bold transition-colors duration-200 mb-2"
          style={{
            color: colors.text.primary,
            textShadow: `0 2px 8px ${colors.background.primary}80`,
          }}
        >
          New Arrivals
        </h2>
        <p className="text-sm md:text-base font-lato" style={{ color: colors.text.secondary }}>
          Discover the newest additions to our catalog
        </p>
      </div>

      <div
        className="md:hidden w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2"
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
      >
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product._id ?? `latest-mobile-${productSlugFromProduct(product)}`}
              onClick={() => navigate(`/product/${productSlugFromProduct(product)}`)}
              className="group flex-shrink-0 snap-start w-[260px] rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              <div
                className="h-40 flex items-center justify-center p-4 relative"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="object-contain max-h-full w-full"
                />
                <ProductCarouselFromPriceOverlay
                  colors={colors}
                  formatPriceWithSymbol={formatPriceWithSymbol}
                  product={product}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold text-sm line-clamp-2 mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                  {product.version && (
                    <span className="font-normal ml-1" style={{ color: colors.text.secondary }}>
                      ({product.version})
                    </span>
                  )}
                </h3>
                <div
                  className="flex items-center gap-1.5 mt-2 text-xs"
                  style={{ color: colors.text.secondary }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New arrival</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block latest-arrivals-track w-full">
        <div className="flex animate-scroll-latest-arrivals gap-6">
          {allProducts.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              onClick={() => navigate(`/product/${productSlugFromProduct(product)}`)}
              className="group flex-shrink-0 w-64 md:w-72 rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              <div
                className="h-40 md:h-48 flex items-center justify-center p-4 relative"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="object-contain max-h-full w-full"
                />
                <ProductCarouselFromPriceOverlay
                  colors={colors}
                  formatPriceWithSymbol={formatPriceWithSymbol}
                  product={product}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold text-sm md:text-base line-clamp-2 mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                  {product.version && (
                    <span className="font-normal ml-1" style={{ color: colors.text.secondary }}>
                      ({product.version})
                    </span>
                  )}
                </h3>
                <div
                  className="flex items-center gap-1.5 mt-2 text-xs"
                  style={{ color: colors.text.secondary }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>New arrival</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestArrivalsCarousel;
