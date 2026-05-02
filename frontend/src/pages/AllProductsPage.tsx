import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { getCategoryListingSEO, buildCanonicalUrl } from "../utils/seo";
import { AllProductsBrandList } from "./allProducts/AllProductsBrandList";
import { AllProductsCategoriesDisplay } from "./allProducts/AllProductsCategoriesDisplay";
import { AllProductsMobileView } from "./allProducts/AllProductsMobileView";

const AllProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { colors } = useAdminTheme();
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const seoData = getCategoryListingSEO({});

  const handleCategoryClick = (brand: string, category: string) => {
    navigate(`/category?brand=${brand}&category=${category}`);
  };

  const handleBrandClick = (brand: string) => {
    navigate(`/category?brand=${brand}`);
  };

  const toggleBrand = (brand: string) => {
    setExpandedBrand(expandedBrand === brand ? null : brand);
  };

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={buildCanonicalUrl(pathname)} />
      </Helmet>

      <div
        className="min-h-screen pt-20 transition-colors duration-200"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div
            className="flex items-center text-sm mb-6 transition-colors duration-200"
            style={{ color: colors.text.secondary }}
          >
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-70 transition-opacity"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span style={{ color: colors.text.primary }}>All Products</span>
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 transition-colors duration-200"
              style={{ color: colors.text.primary }}
            >
              Software Product Categories
            </h1>
            <p
              className="text-base md:text-lg transition-colors duration-200"
              style={{ color: colors.text.secondary }}
            >
              Explore professional software tools designed for every industry
            </p>
          </div>

          <div className="hidden md:flex gap-6">
            <AllProductsBrandList
              colors={colors}
              expandedBrand={expandedBrand}
              onToggleBrand={toggleBrand}
            />

            <div className="flex-1">
              <AllProductsCategoriesDisplay
                colors={colors}
                expandedBrand={expandedBrand}
                onCategoryClick={handleCategoryClick}
                onBrandClick={handleBrandClick}
              />
            </div>
          </div>

          <AllProductsMobileView
            colors={colors}
            expandedBrand={expandedBrand}
            onToggleBrand={toggleBrand}
            onCategoryClick={handleCategoryClick}
            onBrandClick={handleBrandClick}
          />
        </div>
      </div>
    </>
  );
};

export default AllProductsPage;
