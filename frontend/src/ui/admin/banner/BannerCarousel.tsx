import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Banner {
  _id: string;
  title: string;
  description?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  bannerType: "Normal" | "Festival" | "Flash Sale" | "Seasonal";
  position: "Home Page Only" | "Product Page" | "Both";
  priority: number;
  status: "Active" | "Inactive" | "Scheduled";
  startDate: string;
  endDate: string;
  backgroundColor?: string;
  textColor?: string;
}

interface BannerCarouselProps {
  page: "home" | "product";
}

const API_BASE_URL = "http://localhost:5000/api";

const BannerCarousel: React.FC<BannerCarouselProps> = ({ page }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        console.log(`Fetching banners for page: ${page}`);
        const res = await fetch(`${API_BASE_URL}/banners/active/${page}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        console.log(`Banner API response for ${page}:`, result);

        // Handle different response formats
        let banners = [];
        if (result.success && result.data) {
          banners = result.data;
        } else if (Array.isArray(result)) {
          banners = result;
        } else if (result.data && Array.isArray(result.data)) {
          banners = result.data;
        }

        setBanners(banners);
        console.log(`Found ${banners.length} banners for ${page}`);

        if (banners.length === 0) {
          console.log(`No banners found for ${page}. Check if you have banners with position "Product Page" or "Both" in the database.`);
        }
      } catch (err) {
        console.error(`Error fetching banners for ${page}:`, err);
        setBanners([]);
      }
    };
    fetchBanners();
  }, [page]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);

  const handleClick = (link?: string) => {
    if (!link) return;
    if (link.startsWith("http")) window.open(link, "_blank");
    else window.location.href = link;
  };

  // Hide banner if no banners are found
  if (banners.length === 0) {
    return null;
  }
  const banner = banners[current];
  const totalSlides = banners.length;

  return (
    <div className="relative max-w-7xl mx-auto mb-6 px-4" role="region" aria-label="Promotional Carousel">
      <div
        className="relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center justify-center transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, #ffd54a 0%, #ffb344 40%, #f59e0b 100%)`,
          boxShadow: `0 8px 30px rgba(245, 158, 11, 0.18), inset 0 -6px 30px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Sunray behind content */}
        <div
          className="absolute inset-0 animate-rotate-slow z-0"
          style={{
            background: `repeating-conic-gradient(from 0deg, rgba(255,255,255,0.15) 0deg, rgba(255,255,255,0.15) 3deg, transparent 3deg, transparent 15deg)`,
          }}
        ></div>

        {/* Top-left curve (smaller) */}
        <svg
          className="absolute top-0 left-0 w-1/5 h-auto z-10 opacity-80"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(200,0) scale(-1,1)">
            <path
              d="M0,0 C50,30 150,-10 200,30 L200,0 L0,0 Z"
              fill="url(#topCurveGradient)"
            />
          </g>
          <defs>
            <linearGradient id="topCurveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Bottom-right curve (smaller) */}
        <svg
          className="absolute bottom-0 right-0 w-1/5 h-auto z-10 opacity-80"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(200,0) scale(-1,1)">
            <path
              d="M200,100 C150,60 50,110 0,60 L0,100 L200,100 Z"
              fill="url(#bottomCurveGradient)"
            />
          </g>
          <defs>
            <linearGradient id="bottomCurveGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Decorative floating shapes */}
        <div className="absolute top-14 left-1/4 w-3 h-3 text-black/20 animate-float" aria-hidden="true">
          <svg viewBox="0 0 10 10" fill="currentColor">
            <polygon points="5,0 6,3 10,5 6,7 5,10 4,7 0,5 4,3" />
          </svg>
        </div>
        <div className="absolute top-16 right-14 w-4 h-4 text-black/25 animate-float-delay" aria-hidden="true">
          <svg viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-1/3 w-3 h-3 text-black/15 animate-float" aria-hidden="true">
          <svg viewBox="0 0 10 10" fill="currentColor">
            <polygon points="5,0 6,3 10,5 6,7 5,10 4,7 0,5 4,3" />
          </svg>
        </div>
        <div className="absolute bottom-12 right-16 rotate-12 w-10 h-2 bg-black/20 rounded animate-float" aria-hidden="true"></div>

        {/* Navigation buttons */}
        {totalSlides > 1 && (
          <>
            <button onClick={prevSlide} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/60 transition z-30 hidden md:block">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
            <button onClick={nextSlide} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/60 transition z-30 hidden md:block">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        {/* Content */}
        <div key={banner._id} className="relative z-40 w-full max-w-3xl px-4 sm:px-8 text-center flex flex-col items-center gap-3 animate-fade-in">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug drop-shadow-2xl text-white"
            style={{
              WebkitTextStroke: "1.5px rgba(0,0,0,0.6)",
              textShadow: "0 6px 18px rgba(0,0,0,0.35)",
            }}
          >
            {banner.title}
          </h2>
          {banner.description && <p className="text-base sm:text-lg md:text-xl opacity-95 max-w-xl drop-shadow-md text-white">{banner.description}</p>}
          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {/* Primary CTA Button */}
            {banner.ctaButtonText && (
              <button
                onClick={() => handleClick(banner.ctaButtonLink)}
                className={`
        font-bold 
        text-yellow-400 
        hover:text-yellow-500 
        hover:shadow-lg 
        transition-all duration-300 
        shadow-md

        w-full sm:w-auto                 // full width on mobile, auto on larger screens
        px-4 py-2                        // mobile
        sm:px-5 sm:py-2.5                 // tablet
        md:px-6 md:py-3                   // desktop

        rounded-xl                        // mobile
        sm:rounded-2xl                     // tablet
        md:rounded-3xl                     // desktop
      `}
                style={{
                  background: "linear-gradient(135deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 100%)",
                }}
              >
                {banner.ctaButtonText}
              </button>
            )}

            {/* Secondary Button */}
            {banner.secondaryButtonText && (
              <button
                onClick={() => handleClick(banner.secondaryButtonLink)}
                className={`
        font-semibold 
        border 
        border-white/50 
        bg-transparent 
        text-white/90 
        hover:bg-white/10 
        transition-all duration-300

        w-full sm:w-auto                  // full width on mobile
        px-4 py-2                         // mobile
        sm:px-5 sm:py-2.5                  // tablet
        md:px-5 md:py-3                    // desktop

        rounded-lg                        // mobile
        sm:rounded-xl                      // tablet
        md:rounded-2xl                     // desktop
      `}
              >
                {banner.secondaryButtonText}
              </button>
            )}
          </div>

        </div>

        {/* Indicators */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`
      w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-all duration-300
      ${index === current
                    ? "bg-yellow-500 scale-125 shadow-md" // active: brighter yellow, bigger, shadow
                    : "bg-white/40 hover:bg-white/70"} // inactive: semi-transparent white
    `}
              />
            ))}

          </div>
        )}

        {/* Animations */}
        <style>{`
          .animate-fade-in { animation: fadeIn 0.6s ease-out; }
          @keyframes fadeIn { 0% { opacity: 0; transform: translateY(6px);} 100% { opacity: 1; transform: translateY(0);} }

          .animate-rotate-slow { animation: rotate360 120s linear infinite; }
          @keyframes rotate360 { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }

          .animate-float { animation: floatY 4s ease-in-out infinite alternate; }
          .animate-float-delay { animation: floatY 4s ease-in-out 1s infinite alternate; }
          @keyframes floatY { 0% { transform: translateY(0);} 100% { transform: translateY(-8px);} }
        `}</style>
      </div>
    </div>
  );
};

export default BannerCarousel;