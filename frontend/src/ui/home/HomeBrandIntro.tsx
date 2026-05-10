import React from "react";
import { Link } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

/**
 * Visible brand reinforcement on the homepage (complements meta title / Organization schema).
 */
const HomeBrandIntro: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full py-8 sm:py-12 transition-colors duration-200"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        borderTop: `1px solid ${colors.border.primary}`,
      }}
      aria-labelledby="home-about-softzcart-heading"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2
          id="home-about-softzcart-heading"
          className="text-xl sm:text-3xl font-poppins font-bold mb-3 sm:mb-4"
          style={{ color: colors.text.primary }}
        >
          About Softzcart
        </h2>
        <p
          className="text-sm sm:text-lg font-lato leading-relaxed mb-6 sm:mb-8"
          style={{ color: colors.text.secondary }}
        >
          <strong style={{ color: colors.text.primary }}>Softzcart</strong> is an authorized
          software reseller for developer tools, IT solutions, and products from vendors such as
          AutoCAD, Autodesk, Microsoft, and Adobe—with instant delivery and responsive support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link
            to="/about-us"
            className="inline-flex justify-center px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold font-poppins transition-colors duration-200 border"
            style={{
              borderColor: colors.border.primary,
              color: colors.text.primary,
              backgroundColor: colors.background.primary,
            }}
          >
            Learn more about Softzcart
          </Link>
          <Link
            to="/contact"
            className="inline-flex justify-center px-5 py-2.5 rounded-lg text-sm sm:text-base font-semibold font-poppins transition-colors duration-200"
            style={{
              background: colors.interactive.primary,
              color: colors.text.inverse,
            }}
          >
            Contact Softzcart
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeBrandIntro;
