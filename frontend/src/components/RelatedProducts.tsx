import React from "react";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { useProducts } from "../api/productApi";
import type { Product } from "../api/types/productTypes";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";

interface RelatedProductsProps {
  currentProduct: Product;
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


const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, limit = 4 }) => {
  // All hooks must be called unconditionally and at the top
  const { colors } = useAdminTheme();
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const brandKey = getBrandKey(currentProduct);
  const { data, isLoading } = useProducts({
    company: brandKey ? brandKey : undefined,
    limit: 50 // fetch more for better filtering
  });

  if (isLoading) return <div>Loading related products...</div>;
  if (!data || !data.products) return null;

  // Submenu category logic: show products under the same submenu (brand) and submenu category
  let related: Product[] = [];
  if (brandKey && brandCategoryMap[brandKey]) {
    // Find the submenu category for the current product
    const currentSubmenuCat = brandCategoryMap[brandKey].find((cat) =>
      currentProduct.category?.toLowerCase().includes(cat)
    );
    if (currentSubmenuCat) {
      // Show products in the same submenu category (excluding current)
      related = data.products.filter(
        (p) =>
          p._id !== currentProduct._id &&
          p.category?.toLowerCase().includes(currentSubmenuCat)
      );
    } else {
      // If not found, show all products under the same brand submenu
      related = data.products.filter(
        (p) =>
          p._id !== currentProduct._id &&
          brandCategoryMap[brandKey].some((cat) =>
            p.category?.toLowerCase().includes(cat)
          )
      );
    }
  } else {
    // fallback: show same category
    related = data.products.filter(
      (p) => p._id !== currentProduct._id && p.category === currentProduct.category
    );
  }

  if (related.length === 0) return <div>No related products found.</div>;

  const interactiveTint =
    colors.interactive.primary &&
      typeof colors.interactive.primary === "string" &&
      colors.interactive.primary.startsWith("linear-gradient")
      ? `${colors.interactive.secondary}20`
      : `${colors.interactive.primary}20`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
      {related.slice(0, limit).map((product) => (
        <div
          key={product._id}
          className="rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02]"
          style={{
            backgroundColor: colors.background.primary,
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
  );
};

export default RelatedProducts;
