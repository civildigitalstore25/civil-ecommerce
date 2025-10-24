import React from "react";
import FeaturedProducts from "../../components/FeaturedProducts";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const HomeProducts: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full rounded-3xl shadow-sm py-14 px-6 md:px-20 transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.background.secondary}, ${colors.background.primary})`
      }}
    >
      {/* Section Heading */}
      <div className="text-center mb-10">
        <h2
          className="text-3xl md:text-4xl font-bold transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Featured Software
        </h2>
        <p
          className="mt-3 text-lg transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Genuine civil engineering software licenses trusted by thousands of professionals across India
        </p>
      </div>

      {/* Product Grid */}
      <FeaturedProducts limit={6} showCount={false} />
    </section>
  );
};

export default HomeProducts;
