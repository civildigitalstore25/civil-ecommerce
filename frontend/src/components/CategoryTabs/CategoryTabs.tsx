import { CATEGORY_TABS } from "./categoryTabsConfig";
import { useCategoryTabs } from "./useCategoryTabs";
import { CategoryTabsTabBar } from "./CategoryTabsTabBar";
import { CategoryTabsProductCard } from "./CategoryTabsProductCard";

const CategoryTabs = () => {
  const {
    activeTab,
    setActiveTab,
    colors,
    displayedProducts,
    interactiveTint,
    formatPriceWithSymbol,
    navigate,
    handleAddToCart,
  } = useCategoryTabs();

  return (
    <div className="transition-colors duration-200 w-full">
      <CategoryTabsTabBar
        tabs={CATEGORY_TABS}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        colors={colors}
      />

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
            {displayedProducts.map((product, index) => (
              <CategoryTabsProductCard
                key={product._id ?? `product-${index}`}
                product={product}
                index={index}
                colors={colors}
                interactiveTint={interactiveTint}
                formatPriceWithSymbol={formatPriceWithSymbol}
                navigate={navigate}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryTabs;
