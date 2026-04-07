import { BrandCategoryListingEmptyState } from "./brandCategoryListing/BrandCategoryListingEmptyState";
import { BrandCategoryListingHelmet } from "./brandCategoryListing/BrandCategoryListingHelmet";
import { BrandCategoryListingProductGrid } from "./brandCategoryListing/BrandCategoryListingProductGrid";
import { BrandCategoryListingToolbar } from "./brandCategoryListing/BrandCategoryListingToolbar";
import { useBrandCategoryListing } from "./brandCategoryListing/useBrandCategoryListing";

const BrandCategoryListing = () => {
  const {
    brand,
    category,
    searchTerm,
    seoData,
    products,
    sortBy,
    setSortBy,
    sortDropdownOpen,
    setSortDropdownOpen,
    navigate,
    colors,
    formatPriceWithSymbol,
    interactiveTint,
    handleAddToCart,
  } = useBrandCategoryListing();

  return (
    <>
      <BrandCategoryListingHelmet seoData={seoData} />

      <div
        className="min-h-screen transition-colors duration-200 pt-20"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="max-w-7xl mx-auto py-8 px-4">
          <BrandCategoryListingToolbar
            brand={brand}
            category={category}
            searchTerm={searchTerm}
            colors={colors}
            productsLength={products.length}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDropdownOpen={sortDropdownOpen}
            setSortDropdownOpen={setSortDropdownOpen}
            navigate={navigate}
          />

          {products.length === 0 ? (
            <BrandCategoryListingEmptyState
              colors={colors}
              searchTerm={searchTerm}
              onBackHome={() => navigate("/")}
            />
          ) : (
            <BrandCategoryListingProductGrid
              products={products}
              colors={colors}
              interactiveTint={interactiveTint}
              formatPriceWithSymbol={formatPriceWithSymbol}
              onNavigateProduct={(slug) => navigate(`/product/${slug}`)}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BrandCategoryListing;
