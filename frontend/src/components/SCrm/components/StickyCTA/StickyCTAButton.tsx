import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

const StickyCTAButton = () => {
  const { colors } = useAdminTheme();

  const handleClick = () => {
    // Scroll to pricing section or handle CTA action
    const pricingSection = document.querySelector("#pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-4">
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          
          {/* Main button */}
          <button
            onClick={handleClick}
            type="button"
            className="group relative w-full px-8 py-4 text-lg font-bold text-white rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`,
              border: 'none',
              outline: 'none',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primaryHover || colors.interactive.primary}, ${colors.interactive.primary})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`;
            }}
          >
            <div className="flex items-center justify-center gap-3 relative z-10">
              <span className="text-2xl animate-pulse">⚡</span>
              <span className="drop-shadow-sm">Get Instant Access Now</span>
              <span className="ml-2 opacity-80 group-hover:translate-x-1 transition-transform">→</span>
            </div>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent" />
            
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-white/10 rounded-full animate-ping"></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCTAButton;

