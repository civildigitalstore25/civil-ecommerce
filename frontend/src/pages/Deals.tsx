import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingDown } from "lucide-react";
import { getActiveDeals } from "../api/dealsApi";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { CountdownTimer } from "../components/CountdownTimer/CountdownTimer";
const DealsPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { formatPriceWithSymbol } = useCurrency();

  const { data, isLoading } = useQuery({
    queryKey: ["activeDeals"],
    queryFn: getActiveDeals,
    refetchInterval: 60000, // Refetch every minute
  });

  const deals = data?.deals || [];

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2" style={{ borderColor: colors.interactive.primary }}></div>
      </div>
    );
  }

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingDown className="w-10 h-10" style={{ color: colors.status.warning }} />
            <h1
              className="text-4xl md:text-5xl font-bold mt-6"
              style={{ color: colors.text.primary }}
            >
              Active Deals
            </h1>
            <TrendingDown className="w-10 h-10" style={{ color: colors.status.warning }} />
          </div>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Limited time offers - Don't miss out!
          </p>
        </div>

        {/* Deals Grid - Same as BrandCategoryListing */}
        {deals.length === 0 ? (
          <div className="text-center py-20">
            <Clock className="w-20 h-20 mx-auto mb-4 opacity-50" style={{ color: colors.text.secondary }} />
            <h2 className="text-2xl font-semibold mb-2" style={{ color: colors.text.primary }}>
              No Active Deals Right Now
            </h2>
            <p className="text-lg" style={{ color: colors.text.secondary }}>
              Check back soon for amazing offers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {deals.map((product: any) => {
              // Get original and deal prices
              const originalPrice = product.price1INR || product.price1 || 0;
              const dealPrice = product.dealPrice1INR || originalPrice;
              const discount = originalPrice > 0 ? Math.round(((originalPrice - dealPrice) / originalPrice) * 100) : 0;

              // Generate slug
              const slug = `${product.name.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;

              return (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(slug)}
                  className="rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02] cursor-pointer"
                  style={{ backgroundColor: colors.background.primary }}
                >
                  {/* Image - Same height as BrandCategoryListing */}
                  <div
                    className="rounded-lg md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 transition-colors duration-200 relative"
                    style={{ backgroundColor: colors.background.secondary }}
                  >
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Name - Same styling as BrandCategoryListing */}
                  <h2
                    className="text-xs md:text-lg font-semibold mb-0.5 md:mb-1 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]"
                    style={{ color: colors.text.primary }}
                  >
                    {product.name}
                    {product.version && (
                      <span
                        className="font-normal transition-colors duration-200"
                        style={{ color: colors.text.secondary }}
                      >
                        {" "}({product.version})
                      </span>
                    )}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-1 md:mb-2">
                    <span
                      className="text-sm md:text-xl font-bold"
                      style={{ color: colors.status.warning }}
                    >
                      {formatPriceWithSymbol(dealPrice, product.dealPrice1USD || dealPrice / 83)}
                    </span>
                    {discount > 0 && (
                      <span
                        className="text-xs md:text-base line-through opacity-60"
                        style={{ color: colors.text.secondary }}
                      >
                        {formatPriceWithSymbol(originalPrice, (product.price1USD || originalPrice / 83))}
                      </span>
                    )}
                  </div>

                  {/* Countdown */}
                  {product.dealEndDate && (
                    <div className="mb-2 md:mb-3">
                      <CountdownTimer
                        dealEndDate={new Date(product.dealEndDate)}
                        colors={colors}
                      />
                    </div>
                  )}

                  {/* View Deal Button - Same structure as BrandCategoryListing buttons */}
                  <div className="mt-auto">
                    <button
                      className="w-full rounded-md md:rounded-lg py-1 md:py-2 font-semibold text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: "#0068ff",
                        color: "#fff",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(slug);
                      }}
                    >
                      View Deal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
