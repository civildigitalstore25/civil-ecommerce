import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useBannerCarousel } from "./useBannerCarousel";
import { BannerCarouselDecorations } from "./BannerCarouselDecorations";
import { BannerCarouselSlideContent } from "./BannerCarouselSlideContent";
import { BannerCarouselAnimations } from "./BannerCarouselAnimations";

interface BannerCarouselProps {
  page: "home" | "product";
}

const BannerCarousel = ({ page }: BannerCarouselProps) => {
  const {
    banners,
    current,
    setCurrent,
    banner,
    totalSlides,
    prevSlide,
    nextSlide,
    handleClick,
  } = useBannerCarousel(page);

  if (!banner || banners.length === 0) {
    return null;
  }

  return (
    <div
      className="relative max-w-7xl mx-auto mb-6 px-4 mt-6"
      role="region"
      aria-label="Promotional Carousel"
    >
      <div
        className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center gap-4 py-8 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, #1e40af 0%, #1e3a8a 40%, #1e1b4b 100%)`,
          boxShadow: `0 8px 30px rgba(30, 58, 138, 0.18), inset 0 -6px 30px rgba(0,0,0,0.06)`,
        }}
      >
        <BannerCarouselDecorations />

        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition z-30 hidden md:block text-white"
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition z-30 hidden md:block text-white"
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        <BannerCarouselSlideContent banner={banner} onLinkClick={handleClick} />

        {totalSlides > 1 && (
          <div className="flex items-center justify-center space-x-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? "bg-white/90" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <BannerCarouselAnimations />
      </div>
    </div>
  );
};

export default BannerCarousel;
