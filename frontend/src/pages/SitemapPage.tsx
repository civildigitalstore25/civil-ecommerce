import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../api/productApi";
import type { Product } from "../api/types/productTypes";
import { Loader2 } from "lucide-react";
import { useAdminTheme } from "../contexts/AdminThemeContext";

const SitemapPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useAdminTheme();
  const { data, isLoading, error } = useProducts({ limit: 10000 });
  // Filter to only show active products in sitemap (exclude draft and inactive)
  const activeProducts = (data?.products || []).filter((p: any) => p.status === 'active' || !p.status);

  // Organize products by category
  const productsByCategory = useMemo(() => {
    if (!activeProducts || activeProducts.length === 0) return {};

    const organized: { [category: string]: Product[] } = {};

    activeProducts.forEach((product) => {
      const category = product.category || "Uncategorized";

      if (!organized[category]) {
        organized[category] = [];
      }
      organized[category].push(product);
    });

    // Sort products within each category
    Object.keys(organized).forEach(category => {
      organized[category].sort((a, b) => a.name.localeCompare(b.name));
    });

    return organized;
  }, [activeProducts]);

  const handleProductClick = (product: Product) => {
    const namePart = product.name.toLowerCase().replace(/\s+/g, "-");
    const versionPart = product.version ? `-${product.version.toString().toLowerCase().replace(/\s+/g, "-")}` : "";
    const slug = `${namePart}${versionPart}`;

    navigate(`/product/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: colors.interactive.primary }} />
          <p style={{ color: colors.text.secondary }}>Loading sitemap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div
          className="rounded-lg p-6 border"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary
          }}
        >
          <p style={{ color: colors.text.primary }}>Error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-8 px-4"
      style={{ backgroundColor: colors.background.primary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header - Centered */}
        <div className="text-center mb-6">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Sitemap
          </h1>
          <p
            className="text-sm"
            style={{ color: colors.text.secondary }}
          >
            Index of all products available on our platform
          </p>
        </div>

        {/* Products by Category - Column Layout */}
        <div 
          className="gap-4 md:gap-6"
          style={{
            columnCount: 1,
            columnGap: '1rem'
          }}
          // Responsive column count using media queries via style
          ref={(el) => {
            if (el) {
              const updateColumns = () => {
                const width = window.innerWidth;
                if (width >= 1280) {
                  el.style.columnCount = '4';
                  el.style.columnGap = '1.5rem';
                } else if (width >= 1024) {
                  el.style.columnCount = '3';
                  el.style.columnGap = '1.5rem';
                } else if (width >= 768) {
                  el.style.columnCount = '2';
                  el.style.columnGap = '1rem';
                } else {
                  el.style.columnCount = '1';
                  el.style.columnGap = '1rem';
                }
              };
              updateColumns();
              window.addEventListener('resize', updateColumns);
              return () => window.removeEventListener('resize', updateColumns);
            }
          }}
        >
          {Object.keys(productsByCategory)
            .sort()
            .map((category) => (
              <div 
                key={category} 
                className="space-y-2 mb-6"
                style={{
                  breakInside: 'avoid',
                  pageBreakInside: 'avoid',
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                {/* Category Header */}
                <h2
                  className="text-sm md:text-base font-bold pb-2 border-b-2"
                  style={{
                    color: colors.text.primary,
                    borderColor: colors.interactive.primary
                  }}
                >
                  {category}
                </h2>

                {/* Products List under Category - Vertical */}
                <div className="space-y-1.5">
                  {productsByCategory[category].map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left px-2.5 py-2 rounded-md border transition-all duration-200 hover:shadow-md text-base md:text-lg"
                      style={{
                        backgroundColor: colors.background.secondary,
                        borderColor: colors.border.primary,
                        color: colors.text.primary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.interactive.primary;
                        e.currentTarget.style.backgroundColor = colors.background.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colors.border.primary;
                        e.currentTarget.style.backgroundColor = colors.background.secondary;
                      }}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="truncate font-medium leading-tight">{product.name}</span>
                        {product.version && (
                          <span
                            className="text-xs md:text-sm px-1 py-0.5 rounded flex-shrink-0"
                            style={{
                              backgroundColor: colors.interactive.primary + "20",
                              color: colors.interactive.primary
                            }}
                          >
                            v{product.version}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Empty State */}
        {Object.keys(productsByCategory).length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: colors.text.secondary }}>
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitemapPage;
