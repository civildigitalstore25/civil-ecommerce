import React from "react";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { Button } from "../components/common/Button";
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {related.slice(0, limit).map((product) => (
        <div
          key={product._id}
          className="rounded-2xl overflow-hidden transition-colors duration-200 cursor-pointer shadow-lg"
          style={{
            background: colors.background.secondary,
            border: `1.5px solid ${colors.border.primary}`,
          }}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          <div
            className="aspect-video flex items-center justify-center"
            style={{ background: colors.background.tertiary }}
          >
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{ borderRadius: 8 }}
            />
          </div>
          <div className="p-4">
            <h4
              className="font-bold text-lg mb-2"
              style={{ color: colors.text.primary }}
            >
              {product.name}
            </h4>
            <div className="flex items-center justify-between">
              <span
                className="text-2xl font-bold"
                style={{ color: colors.interactive.primary }}
              >
                {product.price1INR ? `₹${product.price1INR}` : product.price1USD ? `$${product.price1USD}` : ""}
              </span>
              <Button
                variant="primary"
                className="!py-2 !px-6 !rounded-xl !text-sm font-semibold shadow-none"
                style={{
                  background: colors.interactive.primary,
                  color: colors.text.inverse,
                  border: `1px solid ${colors.border.accent}`,
                }}
                onClick={(event?: React.MouseEvent) => {
                  if (event) event.stopPropagation();
                  addItem(product, "1year", 1);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedProducts;
