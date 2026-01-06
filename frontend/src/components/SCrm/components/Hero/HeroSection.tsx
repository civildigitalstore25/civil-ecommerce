import React, { useEffect, useState } from "react";
import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

const HeroSection: React.FC = () => {
  const { colors } = useAdminTheme();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsSticky(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPricing = () => {
    const pricingSection = document.querySelector("#pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative bg-slate-950/95 py-20">
      <div className="mx-auto max-w-4xl text-center px-4">

        {/* Rating Row */}
        <div
          className="flex justify-center items-center gap-2 text-sm font-semibold"
          style={{ color: colors.interactive.primary }}
        >
          4.9/5 Rating from 7,800+ Happy Customers
        </div>

        {/* Five Stars */}
        <div className="mt-3 flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-5 w-5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Main Heading */}
        <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-6xl text-white">
          WhatsApp CRM & Marketing
          <br />
          <span style={{ color: colors.interactive.primary }}>Made Simple</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Turn your WhatsApp into a powerful sales machine. Manage leads,
          automate follow-ups, and send bulk campaigns—all from one simple
          dashboard.
        </p>

        {/* CTA Button - Becomes sticky when scrolled past */}
        <div 
          className={`transition-all mt-8 duration-300 flex justify-center ${isSticky ? 'fixed bottom-6 left-0 right-0 z-50' : 'relative'}`}
        >
          <button
            onClick={scrollToPricing}
            className={`px-8 py-3 text-base font-semibold
              rounded-xl
              transition-all duration-200
              bg-white text-gray-800
              hover:bg-gray-100 active:bg-gray-200
              flex items-center justify-center gap-2
              border border-gray-200
              ${isSticky ? 'shadow-lg hover:shadow-xl' : 'hover:shadow-md'}
              whitespace-nowrap
              ${isSticky ? 'w-auto' : 'w-auto px-12'}
            `}
          >
            <span>Get Instant Access Now</span>
            <span className="opacity-80 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
