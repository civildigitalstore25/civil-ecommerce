import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, TrendingDown } from "lucide-react";
import { getActiveDeals } from "../api/dealsApi";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { CountdownTimer } from "../components/CountdownTimer/CountdownTimer";
import { useAdminThemeStyles } from "../hooks/useAdminThemeStyles";

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
      className="min-h-screen py-20 px-4"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingDown className="w-10 h-10" style={{ color: colors.status.warning }} />
            <h1
              className="text-4xl md:text-5xl font-bold mt-6"
              style={{ color: colors.text.primary }}
            >
              🔥 Active Deals
            </h1>
            <TrendingDown className="w-10 h-10" style={{ color: colors.status.warning }} />
          </div>
          <p className="text-lg" style={{ color: colors.text.secondary }}>
            Limited time offers - Don't miss out!
          </p>
        </div>

        {/* Deals Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((product: any) => {
              const { cardStyle, buttonStyle } = useAdminThemeStyles();
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
                  className="rounded-2xl shadow-md p-6 sm:p-8 border transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  style={cardStyle("secondary")}
                >
                  <div className="flex flex-col h-full">
                    <div className="w-full overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.imageUrl || product.image}
                        alt={product.name}
                        className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: colors.background.primary }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold mb-2 line-clamp-2"
                        style={{ color: colors.text.primary }}
                      >
                        {product.name}
                      </h3>

                      {product.version && (
                        <p className="text-sm mb-3" style={{ color: colors.text.secondary }}>
                          Version: {product.version}
                        </p>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-2xl font-bold"
                            style={{ color: colors.status.warning }}
                          >
                            {formatPriceWithSymbol(dealPrice, product.dealPrice1USD || dealPrice / 83)}
                          </span>
                          {discount > 0 && (
                            <span
                              className="text-lg line-through opacity-60"
                              style={{ color: colors.text.secondary }}
                            >
                              {formatPriceWithSymbol(originalPrice, (product.price1USD || originalPrice / 83))}
                            </span>
                          )}
                        </div>
                      </div>

                      {product.dealEndDate && (
                        <div className="mt-2">
                          <div
                            className="text-xs font-semibold mb-2"
                            style={{ color: colors.text.secondary }}
                          >
                            Hurry! Deal ends in:
                          </div>
                          <CountdownTimer
                            dealEndDate={new Date(product.dealEndDate)}
                            colors={colors}
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <button
                        className="w-full py-3 rounded-lg font-semibold transition-all duration-200"
                        style={buttonStyle("primary") as React.CSSProperties}
                      >
                        View Deal
                      </button>
                    </div>
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
