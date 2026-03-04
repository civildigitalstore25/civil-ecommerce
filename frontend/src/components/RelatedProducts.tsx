import React, { useRef, useEffect, useState } from "react";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useProducts } from "../api/productApi";
import type { Product } from "../api/types/productTypes";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsProps {
  currentProduct: Product;
  /** Optional max number to show; omit or set high to show all in carousel */
  limit?: number;
}


// Submenu category mapping as per header (update as needed to match actual header structure)
const brandCategoryMap: Record<string, string[]> = {
  autodesk: [
    "autocad", "autocad-lt", "autocad-mechanical", "autocad-electrical", "autocad-mep", "3ds-max", "maya", "revit", "fusion", "inventor-professional", "civil-3d", "map-3d", "aec-collection", "navisworks-manage"
  ],
  microsoft: [
    "microsoft-365", "microsoft-professional", "microsoft-projects", "server"
  ],
  adobe: [
    "adobe-acrobat", "photoshop", "lightroom", "after-effect", "premier-pro", "illustrator", "adobe-creative-cloud"
  ],
  antivirus: [
    "k7-security", "quick-heal", "norton"
  ]
};


// Helper to get the brand key for submenu logic
const getBrandKey = (product: Product): string | null => {
  const brand = product.brand?.toLowerCase() || product.company?.toLowerCase() || "";
  if (brand.includes("autodesk")) return "autodesk";
  if (brand.includes("microsoft")) return "microsoft";
  if (brand.includes("adobe")) return "adobe";
  if (brand.includes("k7") || brand.includes("quick heal") || brand.includes("norton") || brand.includes("antivirus")) return "antivirus";
  return null;
};


const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, limit: limitProp }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { colors } = useAdminTheme();
  const brandKey = getBrandKey(currentProduct);
  const { data, isLoading } = useProducts({
    company: brandKey ? brandKey : undefined,
    limit: 50 // fetch more for better filtering
  });

  // Compute derived data with safe defaults so we never return before hooks (avoids "Rendered more hooks" error)
  const activeProducts = (data?.products ?? []).filter((p: any) => p.status === 'active' || !p.status);
  let related: Product[] = [];
  if (!isLoading && data?.products && data.products.length > 0) {
    if (brandKey && brandCategoryMap[brandKey]) {
      const currentSubmenuCat = brandCategoryMap[brandKey].find((cat) =>
        currentProduct.category?.toLowerCase().includes(cat)
      );
      if (currentSubmenuCat) {
        related = activeProducts.filter(
          (p) =>
            p._id !== currentProduct._id &&
            p.category?.toLowerCase().includes(currentSubmenuCat)
        );
      } else {
        related = activeProducts.filter(
          (p) =>
            p._id !== currentProduct._id &&
            brandCategoryMap[brandKey].some((cat) =>
              p.category?.toLowerCase().includes(cat)
            )
        );
      }
    } else {
      related = activeProducts.filter(
        (p) => p._id !== currentProduct._id && p.category === currentProduct.category
      );
    }
  }
  const displayList = limitProp != null && limitProp > 0 ? related.slice(0, limitProp) : related;

  const interactiveTint =
    colors.interactive.primary &&
      typeof colors.interactive.primary === "string" &&
      colors.interactive.primary.startsWith("linear-gradient")
      ? `${colors.interactive.secondary}20`
      : `${colors.interactive.primary}20`;

  // Auto-advance carousel every 4 seconds (must run unconditionally, before any return)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayList.length <= 1) return;
    const id = setInterval(() => {
      const step = 304;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const next = Math.min(el.scrollLeft + step, maxScroll);
      el.scrollTo({ left: next, behavior: "smooth" });
      if (next >= maxScroll - 2) {
        setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 600);
      }
      updateScrollButtons();
    }, 4000);
    return () => clearInterval(id);
  }, [displayList.length]);

  // Early returns only after all hooks have run
  if (isLoading) return <div>Loading related products...</div>;
  if (!data || !data.products) return null;
  if (related.length === 0) return <div>No related products found.</div>;

  return (
    <div className="relative group">
      {displayList.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            el.scrollTo({ left: Math.max(0, el.scrollLeft - 304), behavior: "smooth" });
            updateScrollButtons();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
        onScroll={updateScrollButtons}
        className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2"
        style={{ scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}
      >
        {displayList.map((product) => (
        <div
          key={product._id}
          className="flex-shrink-0 w-[260px] md:w-[280px] snap-start rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02] border"
          style={{
            backgroundColor: colors.background.primary,
            borderColor: colors.border.primary,
          }}
        >
          {/* Image */}
          <div
            className="rounded-lg md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
            style={{ backgroundColor: colors.background.secondary }}
            onClick={() => {
              const versionPart = product.version?.trim() ? `-${product.version.toString().trim().toLowerCase()}` : "";
              const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
              navigate(`/product/${slug}`);
            }}
          >
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
            />
            {/* Best Seller Ribbon */}
            {product.isBestSeller && (
              <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 transform transition-all duration-300 hover:scale-110">
                <div className="relative">
                  <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border md:border-2 border-white/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-0.5 md:space-x-1.5">
                      <span className="tracking-wide hidden md:inline">BEST SELLER</span>
                      <span className="tracking-wide md:hidden">BEST</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-full blur-sm opacity-20 -z-10"></div>
                </div>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 md:gap-2 mb-1 md:mb-2">
            <span
              className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: interactiveTint,
                color: (typeof colors.interactive.primary === "string" && colors.interactive.primary.startsWith("linear-gradient")) ? colors.interactive.secondary : colors.interactive.primary,
              }}
            >
              {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : ""}
            </span>
            <span
              className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.secondary,
              }}
            >
              {(() => {
                const brandOrCompany = product.company || product.brand || "";
                return brandOrCompany ? brandOrCompany.charAt(0).toUpperCase() + brandOrCompany.slice(1) : "";
              })()}
            </span>
          </div>

          {/* Name */}
          <h2
            className="text-xs md:text-lg font-semibold mb-0.5 md:mb-1 transition-colors duration-200 line-clamp-2"
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

          {/* Actions */}
          <div className="flex flex-col gap-1 md:gap-2 mt-auto">
            <button
              onClick={() => {
                const versionPart = product.version?.trim() ? `-${product.version.toString().trim().toLowerCase()}` : "";
                const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${versionPart}`;
                navigate(`/product/${slug}`);
              }}
              className="w-full border font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
              style={{
                borderColor: colors.border.primary,
                color: colors.text.primary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addItem(product, "1year", 1);
              }}
              className="w-full font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
        ))}
      </div>

      {/* Next button */}
      {displayList.length > 1 && (
        <button
          type="button"
          onClick={() => {
            const el = scrollRef.current;
            if (!el) return;
            const maxScroll = el.scrollWidth - el.clientWidth;
            el.scrollTo({ left: Math.min(el.scrollLeft + 304, maxScroll), behavior: "smooth" });
            updateScrollButtons();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
