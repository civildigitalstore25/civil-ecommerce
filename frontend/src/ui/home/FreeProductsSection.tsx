import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveFreeProducts } from "../../api/freeProductsApi";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { CountdownTimer } from "../../components/CountdownTimer/CountdownTimer";
import { productSlugFromProduct } from "../../utils/productSlugFromProduct";

const FreeProductsSection: React.FC = () => {
  const { colors } = useAdminTheme();
  const navigate = useNavigate();
  const { data, isLoading } = useActiveFreeProducts();
  const allProducts = data?.products ?? [];

  // Re-render when we cross a product's end time so the card disappears without refresh
  const [now, setNow] = useState(() => new Date());
  const products = useMemo(() => {
    return allProducts.filter(
      (p: any) => p.freeProductEndDate && new Date(p.freeProductEndDate).getTime() > now.getTime()
    );
  }, [allProducts, now]);

  useEffect(() => {
    if (products.length === 0) return;
    const endTimes = products
      .map((p: any) => new Date(p.freeProductEndDate).getTime())
      .filter((t: number) => t > Date.now());
    if (endTimes.length === 0) return;
    const nextEnd = Math.min(...endTimes);
    const delay = Math.max(0, nextEnd - Date.now() + 500);
    const timer = setTimeout(() => setNow(new Date()), delay);
    return () => clearTimeout(timer);
  }, [products]);

  if (isLoading) {
    return (
      <section
        className="w-full py-12 transition-colors duration-200"
        style={{
          background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        }}
      >
        <div className="text-center px-4">
          <div className="animate-pulse h-8 w-48 mx-auto rounded bg-opacity-20" style={{ backgroundColor: colors.border.primary }} />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section
      id="free-products-section"
      className="w-full py-16 transition-colors duration-200"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2
            className="text-2xl md:text-4xl font-poppins font-bold transition-colors duration-200 mb-2"
            style={{
              color: colors.text.primary,
              textShadow: `0 2px 8px ${colors.background.primary}80`,
            }}
          >
            Free for Limited Time
          </h2>
          <p
            className="text-sm md:text-base font-lato"
            style={{ color: colors.text.secondary }}
          >
            Grab these products at ₹0 – no payment required at checkout
          </p>
        </div>

        {/* Mobile: manual horizontal scroll (no auto movement) */}
        <div className="md:hidden w-full overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}>
          <div className="flex gap-4">
            {products.map((product: any) => {
              const slug = productSlugFromProduct(product);
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${slug}`)}
                  className="flex-shrink-0 snap-start w-[260px] rounded-2xl shadow-md overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col"
                  style={{
                    backgroundColor: colors.background.primary,
                    borderColor: colors.border.primary,
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
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold"
                      style={{
                        backgroundColor: colors.status?.success || "#10b981",
                        color: "#fff",
                      }}
                    >
                      FREE
                    </div>
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
                    {product.freeProductEndDate && (
                      <div className="mt-2">
                        <div className="text-xs font-semibold mb-1" style={{ color: colors.text.secondary }}>
                          Ends in:
                        </div>
                        <CountdownTimer
                          dealEndDate={new Date(product.freeProductEndDate)}
                          colors={colors}
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${slug}`);
                      }}
                      className="mt-4 w-full py-2.5 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        backgroundColor: colors.interactive.primary,
                        color: colors.text?.inverse ?? "#fff",
                      }}
                    >
                      Get it free
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const slug = productSlugFromProduct(product);
            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${slug}`)}
                className="rounded-2xl shadow-md overflow-hidden border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer flex flex-col"
                style={{
                  backgroundColor: colors.background.primary,
                  borderColor: colors.border.primary,
                }}
              >
                <div
                  className="h-44 flex items-center justify-center p-4 relative"
                  style={{ backgroundColor: colors.background.secondary }}
                >
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    className="object-contain max-h-full w-full"
                  />
                  <div
                    className="absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold"
                    style={{
                      backgroundColor: colors.status?.success || "#10b981",
                      color: "#fff",
                    }}
                  >
                    FREE
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="font-semibold text-base md:text-lg line-clamp-2 mb-1"
                    style={{ color: colors.text.primary }}
                  >
                    {product.name}
                    {product.version && (
                      <span className="font-normal ml-1" style={{ color: colors.text.secondary }}>
                        ({product.version})
                      </span>
                    )}
                  </h3>
                  {product.freeProductEndDate && (
                    <div className="mt-2">
                      <div className="text-xs font-semibold mb-1" style={{ color: colors.text.secondary }}>
                        Ends in:
                      </div>
                      <CountdownTimer
                        dealEndDate={new Date(product.freeProductEndDate)}
                        colors={colors}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${slug}`);
                    }}
                    className="mt-4 w-full py-2.5 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: colors.interactive.primary,
                      color: colors.text?.inverse ?? "#fff",
                    }}
                  >
                    Get it free
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FreeProductsSection;
