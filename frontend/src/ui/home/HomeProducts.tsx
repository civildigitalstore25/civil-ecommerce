import React from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const HomeProducts: React.FC = () => {
  const { colors } = useAdminTheme();
  
  return (
    <section
      // className="w-full py-6 md:py-14 transition-colors duration-200"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      {/* Unified Container */}
      <div
        // className="rounded-xl md:rounded-3xl overflow-hidden shadow-xl transition-colors duration-200"
        style={{
          background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        }}
      >
        {/* Section Heading */}
        <div
          className="text-center px-4 pb-6 md:pb-12 transition-colors duration-200"
          style={{
            background: "none",
            // Remove border and white bg
          }}
        >
          <h2
            className="text-2xl md:text-4xl font-bold transition-colors duration-200"
            style={{
              color: colors.text.primary,
              textShadow: `0 2px 8px ${colors.background.primary}80`,
            }}
          >
            Featured Software
          </h2>
        </div>

        {/* Product Grid */}
        <div className="px-3 md:px-8 pb-3 md:pb-4">
          <FeaturedProducts limit={10} showCount={false} />
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;