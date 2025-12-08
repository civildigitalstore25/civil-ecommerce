import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, Package } from "lucide-react";
import { useProducts } from "../api/productApi";
import { useUser } from "../api/userQueries";
import { useCartContext } from "../contexts/CartContext";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import Swal from "sweetalert2";

// Brand-Category mapping for display names
const brandLabels: Record<string, string> = {
  autodesk: "Autodesk",
  microsoft: "Microsoft",
  adobe: "Adobe",
  coreldraw: "Coreldraw",
  antivirus: "Antivirus",
  "structural-softwares": "Structural Softwares",
  "architectural-softwares": "Architectural Softwares",
  ebook: "Ebook",
};

const categoryLabels: Record<string, string> = {
  autocad: "AutoCAD",
  "3ds-max": "3ds MAX",
  revit: "Revit",
  maya: "Maya",
  fusion: "Fusion",
  "navisworks-manage": "Navisworks Manage",
  "inventor-professional": "Inventor Professional",
  "autocad-lt": "AutoCAD LT",
  "aec-collection": "AEC Collection",
  "civil-3d": "Civil 3D",
  "map-3d": "Map 3D",
  "autocad-mechanical": "AutoCAD Mechanical",
  "autocad-electrical": "AutoCAD Electrical",
  "autocad-mep": "AutoCAD MEP",
  "microsoft-365": "Microsoft 365",
  "microsoft-professional": "Microsoft Professional",
  "microsoft-projects": "Microsoft Projects",
  server: "Server",
  "adobe-acrobat": "Adobe Acrobat",
  photoshop: "Photoshop",
  lightroom: "Lightroom",
  "after-effect": "After Effect",
  "premier-pro": "Premier Pro",
  illustrator: "Illustrator",
  "adobe-creative-cloud": "Adobe Creative Cloud",
  "coreldraw-graphics-suite": "Coreldraw Graphics Suite",
  "coreldraw-technical-suite": "Coreldraw Technical Suite",
  "k7-security": "K7 Security",
  "quick-heal": "Quick Heal",
  "hyper-say": "Hyper Say",
  norton: "Norton",
  mcafee: "McAfee",
  eset: "ESET",
  "e-tab": "E-Tab",
  safe: "Safe",
  "sap-2000": "Sap 2000",
  tekla: "Tekla",
  lumion: "Lumion",
  "twin-motion": "Twin Motion",
  "d5-render": "D5 Render",
  "archi-cad": "Archi CAD",
};

const BrandCategoryListing: React.FC = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const brand = params.get("brand") || "";
  const category = params.get("category") || "";

  // Build query based on brand and category
  const queryParams: any = {};
  if (brand) {
    queryParams.company = brand; // Backend uses 'company' field
  }
  if (category) {
    queryParams.category = category;
  }

  const { data = { products: [], totalPages: 0, currentPage: 0, total: 0 } } =
    useProducts(queryParams);
  const products = data.products || [];
  const navigate = useNavigate();
  const { addItem } = useCartContext();
  const { data: user } = useUser();
  const { colors } = useAdminTheme();

  const handleAddToCart = async (
    product: any,
    licenseType: "1year" = "1year",
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

  // Get display title
  const getDisplayTitle = () => {
    if (category && brand) {
      const categoryName = categoryLabels[category] || category;
      const brandName = brandLabels[brand] || brand;
      return `${categoryName} - ${brandName}`;
    } else if (brand) {
      return brandLabels[brand] || brand;
    } else if (category) {
      return categoryLabels[category] || category;
    }
    return "All Products";
  };

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-20"
      style={{ backgroundColor: colors.background.secondary }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div
          className="flex items-center text-sm mb-4 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          <button
            onClick={() => navigate("/")}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          {brand && (
            <>
              <span className="mx-2">/</span>
              <button
                onClick={() => navigate(`/category?brand=${brand}`)}
                className="hover:text-blue-600 transition-colors"
              >
                {brandLabels[brand] || brand}
              </button>
            </>
          )}
          {category && (
            <>
              <span className="mx-2">/</span>
              <span style={{ color: colors.text.primary }}>
                {categoryLabels[category] || category}
              </span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-4xl font-bold mb-2 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            {getDisplayTitle()}
          </h1>
          <p
            className="text-lg transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            {products.length} product{products.length !== 1 && "s"} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package
              className="w-24 h-24 mb-4"
              style={{ color: colors.text.secondary }}
            />
            <h3
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.text.primary }}
            >
              No Products Found
            </h3>
            <p
              className="text-lg mb-6"
              style={{ color: colors.text.secondary }}
            >
              We couldn't find any products in this category.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.background.primary,
              }}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-0.5 md:gap-8">
            {products.map((product: any) => (
              <div
                key={product._id}
                className="rounded-none md:rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02]"
                style={{
                  backgroundColor: colors.background.primary,
                }}
              >
                {/* Image */}
                <div
                  className="rounded-lg md:rounded-xl overflow-hidden h-32 md:h-52 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative"
                  style={{ backgroundColor: colors.background.secondary }}
                  onClick={() => {
                    const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;
                    navigate(`/product/${slug}`);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  {/* Best Seller Ribbon */}
                  {product.isBestSeller && (
                    <div className="absolute top-1 right-1 md:top-3 md:right-3 z-10 transform transition-all duration-300 hover:scale-110">
                      <div className="relative">
                        {/* Main ribbon */}
                        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-black text-[8px] md:text-xs font-bold px-1.5 py-0.5 md:px-4 md:py-2 rounded-sm md:rounded-md shadow-2xl border md:border-2 border-white/50 backdrop-blur-sm">
                          <div className="flex items-center space-x-0.5 md:space-x-1.5">
                            <Star className="w-2 h-2 md:w-3.5 md:h-3.5 fill-current text-yellow-100 animate-pulse" />
                            <span className="tracking-wide hidden md:inline">BEST SELLER</span>
                            <span className="tracking-wide md:hidden">BEST</span>
                          </div>
                        </div>
                        {/* Glow effect */}
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
                      backgroundColor: `${colors.interactive.primary}20`,
                      color: colors.interactive.primary,
                    }}
                  >
                    {product.category}
                  </span>
                  <span
                    className="text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.secondary,
                      color: colors.text.secondary,
                    }}
                  >
                    {product.company}
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
                      ({product.version})
                    </span>
                  )}
                </h2>

                {/* Stars & Ratings */}
                <div className="flex items-center text-[10px] md:text-sm mb-1 md:mb-2">
                  <span className="text-yellow-400 mr-0.5 md:mr-1">
                    {"★".repeat(Math.round(product.rating || 4))}{" "}
                  </span>
                  <span
                    className="transition-colors duration-200"
                    style={{ color: colors.text.accent }}
                  >
                    {product.ratingCount ? `(${product.ratingCount})` : ""}
                  </span>
                </div>

                {/* Price and short description hidden in listing view */}

                {/* Actions */}
                <div className="flex flex-col gap-1 md:gap-2 mt-auto">
                  <button
                    onClick={() => {
                      const slug = `${product.name?.replace(/\s+/g, "-").toLowerCase()}${product.version ? `-${product.version.toString().toLowerCase()}` : ""}`;
                      navigate(`/product/${slug}`);
                    }}
                    className="w-full border font-medium rounded-md md:rounded-lg py-1 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.background.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    BUY NOW
                  </button>
                  <button
                    className="w-full rounded-md md:rounded-lg py-1 md:py-2 font-semibold text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`,
                      color: colors.background.primary,
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
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

export default BrandCategoryListing;
