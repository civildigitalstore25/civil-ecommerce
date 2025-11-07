// ============================================
// FILE: src/components/banners/BannerDisplay.tsx
// ============================================
import React, { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

interface Banner {
  _id: string;
  title: string;
  description?: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  bannerType: string;
  backgroundColor?: string;
  textColor?: string;
}

interface BannerDisplayProps {
  position: "home" | "product";
}

const BannerDisplay: React.FC<BannerDisplayProps> = ({ position }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, [position]);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // Auto-rotate every 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/banners/active/${position}`);
      const data = await response.json();
      setBanners(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTAClick = () => {
    const currentBanner = banners[currentIndex];
    if (currentBanner.ctaButtonLink) {
      window.location.href = currentBanner.ctaButtonLink;
    }
  };

  // Don't render if not visible, loading, or no banners
  if (!isVisible || isLoading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  // Fallback gradient based on banner type
  const getBannerGradient = (type: string) => {
    switch (type.toUpperCase()) {
      case "FESTIVAL":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "FLASH SALE":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "SEASONAL":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      default:
        return "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)";
    }
  };

  return (
    <div className="w-full mb-6 animate-fadeIn">
      <div
        className="relative overflow-hidden rounded-lg shadow-lg"
        style={{
          background:
            currentBanner.backgroundColor ||
            getBannerGradient(currentBanner.bannerType),
          color: currentBanner.textColor || "#FFFFFF",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all z-10"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>

        {/* Banner Content */}
        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="max-w-4xl">
            {/* Banner Type Badge */}
            <div className="inline-block mb-4">
              <span className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {currentBanner.bannerType}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {currentBanner.title}
            </h2>

            {/* Description */}
            {currentBanner.description && (
              <p className="text-lg md:text-xl mb-6 opacity-90 max-w-2xl">
                {currentBanner.description}
              </p>
            )}

            {/* CTA Button */}
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center gap-2 bg-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ color: currentBanner.backgroundColor || "#3B82F6" }}
            >
              {currentBanner.ctaButtonText}
              {currentBanner.ctaButtonLink && <ExternalLink size={18} />}
            </button>
          </div>
        </div>

        {/* Pagination Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pb-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -ml-48 -mb-48 blur-3xl" />
      </div>
    </div>
  );
};

export default BannerDisplay;
