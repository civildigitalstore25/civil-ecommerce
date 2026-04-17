import type { ProductDetailTabNavProps } from "./tabTypes";

export function ProductDetailTabNav({
  colors,
  renderedTabs,
  activeTab,
  setActiveTab,
  reviewTotalCount,
}: ProductDetailTabNavProps) {
  return (
    <div className="border-b" style={{ borderColor: colors.border.primary }}>
      <div className="flex gap-4 lg:gap-8 overflow-x-auto scrollbar-hide">
        {renderedTabs.map((tabKey) => {
          const label =
            tabKey === "details"
              ? "Product Details"
              : tabKey === "features"
                ? "Features"
                : tabKey === "requirements"
                  ? "System"
                  : tabKey === "reviews"
                    ? `Reviews (${reviewTotalCount})`
                    : "FAQ";

          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => setActiveTab(tabKey)}
              className="py-3 lg:py-4 px-1 lg:px-2 font-medium transition-colors duration-200 border-b-2 whitespace-nowrap text-sm lg:text-base flex-shrink-0"
              style={{
                borderColor:
                  activeTab === tabKey
                    ? colors.interactive.primary
                    : "transparent",
                color:
                  activeTab === tabKey
                    ? colors.interactive.primary
                    : colors.text.secondary,
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tabKey) {
                  e.currentTarget.style.color = colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tabKey) {
                  e.currentTarget.style.color = colors.text.secondary;
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
