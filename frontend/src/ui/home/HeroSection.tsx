import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  CloudArrowDownIcon,
  ShieldCheckIcon,
  StarIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAdminTheme } from '../../contexts/AdminThemeContext';

const API_BASE_URL = 'http://localhost:5000/api';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  ctaButtonText: string;
  ctaButtonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  bannerType: string;
  priority: number;
}

const features = [
  {
    icon: <UserGroupIcon className="h-12 w-14 text-violet-600/80" />,
    value: "5000+",
    label: "Happy Engineers",
  },
  {
    icon: <CloudArrowDownIcon className="h-12 w-14 text-blue-600/80" />,
    value: "12,500+",
    label: "Software Delivered",
  },
  {
    icon: <ShieldCheckIcon className="h-12 w-14 text-emerald-600/80" />,
    value: "100%",
    label: "Secure Transactions",
  },
  {
    icon: <StarIcon className="h-12 w-14 text-amber-500/80" />,
    value: "4.9/5",
    label: "Customer Rating",
  },
];

const paymentMethods = [
  {
    icon: <DevicePhoneMobileIcon className="h-5 w-5 text-pink-500" />,
    label: "UPI & Mobile Payments",
  },
  {
    icon: <CreditCardIcon className="h-5 w-5 text-blue-600" />,
    label: "Secure Cards",
  },
  {
    icon: <BoltIcon className="h-5 w-5 text-yellow-400" />,
    label: "Instant Activation",
  },
];

const HeroSection: React.FC = () => {
  const { colors, theme } = useAdminTheme();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  useEffect(() => {
    fetchActiveBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchActiveBanners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/banners/active/home`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setBanners(result.data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => 
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (link?: string) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  const handleExploreProducts = () => {
    window.location.href = '/products';
  };

  const handleCloseBanner = () => {
    setIsBannerClosed(true);
  };

  const currentBanner = banners[currentBannerIndex];

  return (
    <section 
      className="py-14 px-4 sm:py-20 sm:px-6 transition-colors duration-300"
      style={{ 
        background: theme === 'light' 
          ? 'linear-gradient(to bottom right, #f9fafb, #ffffff)' 
          : 'linear-gradient(to bottom right, #111827, #1f2937)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Banner Section */}
        {!loading && banners.length > 0 && !isBannerClosed && (
          <div className="mb-12 relative">
            <div
              className="rounded-2xl p-8 sm:p-12 shadow-lg transition-all duration-500 relative overflow-hidden"
              style={{
                backgroundColor: currentBanner.backgroundColor || colors.interactive.primary,
                color: currentBanner.textColor || colors.text.inverse,
              }}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseBanner}
                className="absolute top-4 left-4 p-1.5 rounded-full transition-all duration-200 z-20 hover:rotate-90"
                style={{
                  backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(4px)'
                }}
                aria-label="Close banner"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              {/* Banner Type Badge */}
              <div className="absolute top-4 right-4">
                <span 
                  className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase"
                  style={{
                    backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: currentBanner.textColor || colors.text.inverse
                  }}
                >
                  {currentBanner.bannerType}
                </span>
              </div>

              {/* Banner Content */}
              <div className="max-w-3xl relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {currentBanner.title}
                </h2>
                
                {currentBanner.description && (
                  <p className="text-lg sm:text-xl mb-6 opacity-90 leading-relaxed">
                    {currentBanner.description}
                  </p>
                )}

                <button
                  onClick={() => handleBannerClick(currentBanner.ctaButtonLink)}
                  className="px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  style={{ 
                    backgroundColor: theme === 'light' ? '#ffffff' : colors.background.secondary,
                    color: currentBanner.backgroundColor || colors.interactive.primary
                  }}
                >
                  {currentBanner.ctaButtonText}
                </button>
              </div>

              {/* Navigation Arrows */}
              {banners.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 z-10"
                    style={{
                      backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Previous banner"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  
                  <button
                    onClick={handleNextBanner}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-200 z-10"
                    style={{
                      backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(4px)'
                    }}
                    aria-label="Next banner"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBannerIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300`}
                        style={{
                          width: index === currentBannerIndex ? '32px' : '8px',
                          backgroundColor: index === currentBannerIndex 
                            ? (theme === 'light' ? '#ffffff' : colors.text.primary)
                            : (theme === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(249, 250, 251, 0.5)')
                        }}
                        aria-label={`Go to banner ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Original Hero Content */}
        <div className="flex flex-col items-center">
          <h1 
            className="text-4xl sm:text-5xl font-serif font-bold mb-6 tracking-wide leading-snug text-center"
            style={{ color: colors.text.primary }}
          >
            Genuine Civil <br />
            Engineering Software
          </h1>

          <p 
            className="mb-12 text-lg sm:text-xl font-serif leading-relaxed text-center max-w-2xl"
            style={{ color: colors.text.secondary }}
          >
            Get authentic AutoCAD, Revit, Lumion, Tekla and other professional software licenses
            with instant delivery and lifetime support.
          </p>

          <div className="flex justify-center w-full sm:w-auto mb-16">
            <button
              onClick={handleExploreProducts}
              className="px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              style={{
                backgroundColor: colors.interactive.primary,
                color: colors.text.inverse
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.interactive.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.interactive.primary;
              }}
            >
              Explore Products
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full mb-12">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-2xl py-7 px-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                style={{
                  backgroundColor: colors.background.secondary,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: colors.border.primary
                }}
              >
                <div className="mb-3">{f.icon}</div>
                <div 
                  className="text-2xl font-extrabold mb-0.5 font-sans"
                  style={{ color: colors.text.primary }}
                >
                  {f.value}
                </div>
                <div 
                  className="text-base font-medium font-sans text-center"
                  style={{ color: colors.text.secondary }}
                >
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div 
            className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm font-medium font-sans"
            style={{ color: colors.text.secondary }}
          >
            {paymentMethods.map((method) => (
              <span key={method.label} className="flex items-center gap-2">
                {method.icon}
                {method.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;