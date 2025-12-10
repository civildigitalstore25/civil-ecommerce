import React from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const HomeProducts: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full py-14 px-0 md:px-20 transition-colors duration-200"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      {/* Section Heading */}
      <div
        className="text-center mb-10 rounded-2xl md:rounded-3xl px-4 py-8 md:py-12 shadow-lg transition-colors duration-200"
        style={{
          background: `linear-gradient(90deg, ${colors.interactive.primary}10 0%, ${colors.interactive.primaryHover}10 100%)`,
          border: `1.5px solid ${colors.border.primary}`,
        }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold transition-colors duration-200"
          style={{
            color: colors.text.primary,
            textShadow: `0 2px 8px ${colors.background.primary}80`,
          }}
        >
          Featured Software
        </h2>
       
      </div>

      {/* Product Grid */}
      <div
        className="rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl transition-colors duration-200"
        style={{
          background: colors.background.secondary,
          border: `1.5px solid ${colors.border.primary}`,
        }}
      >
        <FeaturedProducts limit={6} showCount={false} />
      </div>
    </section>
  );
};

export default HomeProducts;
