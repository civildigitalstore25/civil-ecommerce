import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const HeroSection: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section className="border-b border-white/10 bg-slate-950/95 py-20">
      <div className="mx-auto max-w-4xl text-center px-4">

        {/* Rating Row */}
        <div
          className="flex justify-center items-center gap-2 text-sm font-semibold"
          style={{ color: colors.interactive.primary }}
        >
          ⭐ 4.9/5 Rating from 7,800+ Happy Customers
        </div>

        {/* Five Stars */}
        <div className="mt-3 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-2xl">★</span>
          ))}
        </div>

        {/* Spacing */}
        <div className="mt-6" />

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] text-white">
          Stop{" "}
          <span style={{ color: colors.interactive.primary }}>Losing Leads</span>.{" "}
          Start{" "}
          <span style={{ color: colors.interactive.primary }}>Closing</span> Deals
          on WhatsApp.
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
          Turn your WhatsApp into a powerful sales machine. Manage leads,
          automate follow-ups, and send bulk campaigns—all from one simple
          dashboard.
        </p>

        {/* CTA Button */}
        <button
         className="
  mt-10 px-10 py-4 text-lg font-semibold text-black 
  rounded-xl                     /* semi-rounded */
  shadow-xl transition-all duration-300
  hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,215,0,0.55)]
"

          style={{
            background: `linear-gradient(90deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover})`,
          }}
        >
          Get Instant Access Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
