import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useProducts } from "../../api/productApi";
import { useUser } from "../../api/userQueries";
import { useCartContext } from "../../contexts/CartContext";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import Swal from "sweetalert2";

// Define the categories/brands to show as tabs
const CATEGORY_TABS = [
  { id: "autocad", label: "AutoCAD", company: "autodesk" },
  { id: "microsoft", label: "Microsoft", company: "microsoft" },
  { id: "antivirus", label: "Antivirus", company: "antivirus" },
  { id: "adobe", label: "Adobe", company: "adobe" },
  { id: "corel", label: "Corel", company: "corel" },
];

const CategoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(CATEGORY_TABS[0].id);
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();

  // Get the active category's company name
  const activeCategory = CATEGORY_TABS.find((tab) => tab.id === activeTab);
  const companyFilter = activeCategory?.company || "";

  // Fetch products filtered by company
  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts({
      company: companyFilter,
      limit: 5,
    });

  const products = data.products || [];

  // Filter out 'others' brand
  const visibleProducts = products.filter((p: any) => {
    const b = (p.brand || p.company || "").toString().toLowerCase();
    return b !== "others";
  });

  const displayedProducts = visibleProducts.slice(0, 5);

  const interactiveTint =
    colors.interactive.primary &&
      typeof colors.interactive.primary === "string" &&
      colors.interactive.primary.startsWith("linear-gradient")
      ? `${colors.interactive.secondary}20`
      : `${colors.interactive.primary}20`;

  const handleAddToCart = async (
    product: any,
    licenseType: "1year" = "1year"
  ) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addItem(product, licenseType, 1);
      Swal.fire({
        title: "Added to Cart!",
        text: `${product.name} has been added to your cart`,
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to add item to cart",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className="transition-colors duration-200 w-full">
      {/* Tabs */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg transition-all duration-300 hover:scale-105 ${activeTab === tab.id ? "shadow-lg" : "shadow-md"
                }`}
              style={{
                background:
                  activeTab === tab.id
                    ? "#0068ff"
                    : colors.background.secondary,
                color:
                  activeTab === tab.id
                    ? "#fff"
                    : colors.text.primary,
                border:
                  activeTab === tab.id
                    ? "2px solid #0068ff"
                    : `1.5px solid ${colors.border.primary}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full">
        {displayedProducts.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg"
            style={{
              backgroundColor: colors.background.secondary,
              color: colors.text.secondary,
            }}
          >
            <p className="text-lg">No products available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-6">
            {displayedProducts.map((product: any) => (
              <div
                key={product._id}
                className="rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
                  border: `1.5px solid ${colors.border.primary}`,
                }}
              >
                {/* Image */}
                <div
                  className="rounded-md md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
                  style={{ backgroundColor: colors.background.secondary }}
                  onClick={() => {
                    const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;
                    navigate(`/product/${slug}`);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  {/* Best Seller Ribbon */}
                  {product.isBestSeller && (
                    <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 transform transition-all duration-300 hover:scale-110">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border border-white/50 backdrop-blur-sm">
                          <div className="flex items-center space-x-0.5 md:space-x-1.5">
                            <Star className="w-2 h-2 md:w-3.5 md:h-3.5 fill-current text-yellow-100 animate-pulse" />
                            <span className="tracking-wide hidden md:inline">
                              BEST SELLER
                            </span>
                            <span className="tracking-wide md:hidden">BEST</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 rounded-full blur-sm opacity-20 -z-10"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 md:gap-2 mb-1.5 md:mb-2">
                  <span
                    className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200 font-medium"
                    style={{
                      backgroundColor: interactiveTint,
                      color:
                        typeof colors.interactive.primary === "string" &&
                          colors.interactive.primary.startsWith("linear-gradient")
                          ? colors.interactive.secondary
                          : colors.interactive.primary,
                    }}
                  >
                    {product.category
                      ? product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)
                      : ""}
                  </span>
                  <span
                    className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200 font-medium"
                    style={{
                      backgroundColor: colors.background.secondary,
                      color: colors.text.secondary,
                    }}
                  >
                    {product.company
                      ? product.company.charAt(0).toUpperCase() +
                      product.company.slice(1)
                      : ""}
                  </span>
                </div>

                {/* Name */}
                <h2
                  className="text-[11px] md:text-lg font-semibold mb-1 md:mb-1 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]"
                  style={{ color: colors.text.primary }}
                >
                  {product.name}
                  {product.version && (
                    <span
                      className="font-normal ml-1 transition-colors duration-200"
                      style={{ color: colors.text.secondary }}
                    >
                      ({product.version})
                    </span>
                  )}
                </h2>

                {/* Stars & Ratings */}
                <div className="flex items-center text-[10px] md:text-sm mb-2 md:mb-3">
                  <span className="text-yellow-400 mr-0.5 md:mr-1">
                    {"★".repeat(Math.round(product.rating || 4))}
                  </span>
                  <span
                    className="transition-colors duration-200 text-[9px] md:text-xs"
                    style={{ color: colors.text.accent }}
                  >
                    {product.ratingCount ? `(${product.ratingCount})` : ""}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 md:gap-2 mt-auto">
                  <button
                    className="w-full font-bold rounded-md md:rounded-lg py-1.5 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      ...(product.isOutOfStock
                        ? {
                          background: colors.background.accent,
                          color: colors.status.error,
                          border: `1px solid ${colors.status.error}`,
                          cursor: "not-allowed",
                        }
                        : {
                          background: "#0068ff",
                          color: "#fff",
                          border: "1.5px solid #0068ff",
                        }),
                    }}
                    onMouseEnter={(e) => {
                      if (!product.isOutOfStock) {
                        e.currentTarget.style.background =
                          colors.interactive.primaryHover;
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!product.isOutOfStock) {
                        e.currentTarget.style.background = "#0068ff";
                        e.currentTarget.style.color = "#fff";
                      }
                    }}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.isOutOfStock}
                  >
                    {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;
