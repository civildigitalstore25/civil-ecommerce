import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { useBestSellingProducts } from "../../api/productApi";

const BestSellingCarousel: React.FC = () => {
  const { colors } = useAdminTheme();
  const navigate = useNavigate();
  const { data, isLoading } = useBestSellingProducts(10);
  const products = data?.products ?? [];

  const allProducts = useMemo(() => {
    if (products.length === 0) return [];
    return [...products, ...products];
  }, [products]);

  const getSlug = (product: any) => {
    const versionPart = product.version?.trim()
      ? `-${product.version.toString().trim().toLowerCase()}`
      : "";
    return `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
  };

  if (isLoading) {
    return (
      <section
        className="w-full py-16 transition-colors duration-200"
        style={{
          background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        }}
      >
        <div className="text-center px-4">
          <div style={{ color: colors.text.secondary }}>Loading best sellers...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      id="best-selling-section"
      className="w-full py-16 transition-colors duration-200 overflow-hidden"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      <style>{`
        @keyframes scroll-best-selling {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-best-selling {
          animation: scroll-best-selling ${products.length * 4}s linear infinite;
          will-change: transform;
        }
        .best-selling-track:hover .animate-scroll-best-selling {
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
          Best Selling Products
        </h2>
        <p
          className="text-sm md:text-base font-lato"
          style={{ color: colors.text.secondary }}
        >
          Most ordered by our customers
        </p>
      </div>

      <div className="best-selling-track w-full">
        <div className="flex animate-scroll-best-selling gap-6">
          {allProducts.map((product: any, index: number) => (
            <div
              key={`${product._id}-${index}`}
              onClick={() => navigate(`/product/${getSlug(product)}`)}
              className="flex-shrink-0 w-64 md:w-72 rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.primary}`,
              }}
            >
              <div
                className="h-40 md:h-48 flex items-center justify-center p-4"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <img
                  src={product.image || product.imageUrl}
                  alt={product.name}
                  className="object-contain max-h-full w-full"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold text-sm md:text-base line-clamp-2 mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                  {product.version && (
                    <span
                      className="font-normal ml-1"
                      style={{ color: colors.text.secondary }}
                    >
                      ({product.version})
                    </span>
                  )}
                </h3>
                {(product.soldCount ?? 0) > 0 && (
                  <div
                    className="flex items-center gap-1.5 mt-2 text-xs"
                    style={{ color: colors.text.secondary }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{product.soldCount} sold</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingCarousel;