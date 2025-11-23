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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Backdrop with blur */}
      {/* Button container */}
      <div className="relative mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-center justify-center">
          <button
            onClick={handleClick}
            type="button"
            className="group relative w-full max-w-md px-6 py-3.5 text-base font-bold text-slate-900 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primaryHover || colors.interactive.primary}, ${colors.interactive.primary})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primary}, ${colors.interactive.primaryHover || colors.interactive.primary})`;
            }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⚡</span>
              <span>Get Instant Access Now</span>
            </div>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCTAButton;

