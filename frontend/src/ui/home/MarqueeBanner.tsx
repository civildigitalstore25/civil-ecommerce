import React from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const MarqueeBanner: React.FC = () => {
  const { colors } = useAdminTheme();

  return (
    <section
      className="w-full overflow-hidden shadow-md transition-colors duration-200"
      style={{
        background: `linear-gradient(to right, ${colors.interactive.primary}, ${colors.interactive.secondary})`
      }}
    >
      <div className="relative flex overflow-hidden">
        <div
          className="animate-marquee flex items-center space-x-12 py-2 text-base font-medium transition-colors duration-200"
          style={{ color: colors.background.primary }}
        >
          <span>🔥 Genuine software licenses at <strong>90% OFF</strong> – grab it now!</span>
          <span>🎉 Limited time offer – <strong>Hurry, stocks running out!</strong></span>
          <span>⭐ Trusted by 10,000+ users – Don't miss your chance!..</span>
          <span className="inline-block w-1"></span>
        </div>

        <div
          className="animate-marquee flex items-center space-x-12 py-2 text-base font-medium transition-colors duration-200"
          aria-hidden="true"
          style={{ color: colors.background.primary }}
        >
          <span>🔥 Genuine software licenses at <strong>90% OFF</strong> – grab it now!</span>
          <span>🎉 Limited time offer – <strong>Hurry, stocks running out!</strong></span>
          <span>⭐ Trusted by 10,000+ users – Don't miss your chance!</span>
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            flex-shrink: 0;
            min-inline-size: 100%;
            animation: marquee 25s linear infinite;
          }
          .relative:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
};

export default MarqueeBanner;