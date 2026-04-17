/** Keyframes for BannerCarousel (injected once per mount). */
export function BannerCarouselAnimations() {
  return (
    <style>{`
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      @keyframes fadeIn { 0% { opacity: 0; transform: translateY(6px);} 100% { opacity: 1; transform: translateY(0);} }

      .animate-rotate-slow { animation: rotate360 120s linear infinite; }
      @keyframes rotate360 { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }

      .animate-float { animation: floatY 4s ease-in-out infinite alternate; }
      .animate-float-delay { animation: floatY 4s ease-in-out 1s infinite alternate; }
      @keyframes floatY { 0% { transform: translateY(0);} 100% { transform: translateY(-8px);} }
    `}</style>
  );
}
