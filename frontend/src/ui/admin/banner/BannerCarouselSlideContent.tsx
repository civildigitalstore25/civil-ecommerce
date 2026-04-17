import type { Banner } from "../../../types/Banner";

interface BannerCarouselSlideContentProps {
  banner: Banner;
  onLinkClick: (link?: string) => void;
}

export function BannerCarouselSlideContent({
  banner,
  onLinkClick,
}: BannerCarouselSlideContentProps) {
  return (
    <div
      key={banner._id}
      className="relative z-40 w-full max-w-3xl px-4 sm:px-8 text-center flex flex-col items-center gap-3 animate-fade-in"
    >
      <h2
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug drop-shadow-2xl text-white"
        style={{
          WebkitTextStroke: "1.5px rgba(0,0,0,0.6)",
          textShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        {banner.title}
      </h2>
      {banner.description && (
        <p className="text-base sm:text-lg md:text-xl opacity-95 max-w-xl drop-shadow-md text-white">
          {banner.description}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {banner.ctaButtonText && (
          <button
            type="button"
            onClick={() => onLinkClick(banner.ctaButtonLink)}
            className="font-bold text-yellow-400 hover:text-yellow-500 hover:shadow-lg transition-all duration-300 shadow-md w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl md:rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 100%)",
            }}
          >
            {banner.ctaButtonText}
          </button>
        )}

        {banner.secondaryButtonText && (
          <button
            type="button"
            onClick={() => onLinkClick(banner.secondaryButtonLink)}
            className="font-semibold border border-white/50 bg-transparent text-white/90 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 md:px-5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl"
          >
            {banner.secondaryButtonText}
          </button>
        )}
      </div>
    </div>
  );
}
