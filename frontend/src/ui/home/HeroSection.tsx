import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import heroImage from '../../assets/images/hero-software-showcase.png';
import {
  UserGroupIcon,
  CloudArrowDownIcon,
  ShieldCheckIcon,
  StarIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import BannerCarousel from "../admin/banner/BannerCarousel";

const features = [
  {
    icon: <UserGroupIcon className="h-12 w-14 text-violet-600/80" />,
    value: "5000+",
    label: "Happy Engineers",
  },
  {
    icon: <CloudArrowDownIcon className="h-12 w-14 text-blue-600/80" />,
    value: "12,500+",
    label: "Downloads",
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

const highlights = [
  { icon: <SparklesIcon className="h-5 w-5" />, text: "Curated Software & Tools" },
  { icon: <CheckCircleIcon className="h-5 w-5" />, text: "Licensed & Authentic" },
  { icon: <BoltIcon className="h-5 w-5" />, text: "Instant Activation" },
];

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { colors, theme } = useAdminTheme();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-play carousel for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
    
      style={{
        background:
          theme === "light"
            ? `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`
            : `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
      }}
    >
    

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ===== Banner Carousel - Hidden on mobile ===== */}
          <div className="hidden md:block mb-12">
            <BannerCarousel page="home" />
          </div>

          {/* ===== Main Hero Grid Layout ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
            {/* Left Column - Content */}
            <div
              className={`flex flex-col justify-center transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                }`}
            >
             

              {/* Main Heading */}
              <h1
                className="text-xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-3 sm:mb-6 tracking-tight leading-tight"
                style={{ color: colors.text.primary }}
              >
                <span className="sm:hidden">Premium Software & Ebooks</span>
                <span className="hidden sm:inline">
                  Softzcart - Ultimate Destination for Premium Software & Ebooks
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="text-xs sm:text-lg lg:text-xl font-lato leading-relaxed mb-5 sm:mb-8"
                style={{ color: colors.text.secondary }}
              >
               Discover premium engineering software and ebooks in one place. Softzcart is an authorized software reseller—developer tools, vendor software, and IT solutions with instant delivery and support for engineers and teams.
              </p>

              {/* Highlights */}
              <div className="hidden sm:block space-y-3 mb-8 sm:mb-10">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="flex-shrink-0"
                      style={{ color: colors.interactive.primary }}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm sm:text-base" style={{ color: colors.text.primary }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => navigate("/products")}
                  className="group px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: colors.interactive.primary,
                    color: colors.text.inverse,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.interactive.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.interactive.primary;
                  }}
                >
                  Explore All Products
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Info */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-4 text-[9px] sm:text-sm font-medium">
                {paymentMethods.map((method) => (
                  <span key={method.label} className="flex flex-col items-center justify-start gap-1 text-center sm:flex-row sm:gap-2 sm:text-left" style={{ color: colors.text.secondary }}>
                    {method.icon}
                    {method.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Visual/Image Placeholder with Stats */}
            <div
              className={`relative hidden sm:block transform transition-all duration-1000 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                }`}
            >
              {/* Gradient Background Card with Hero Image */}
              <div
                className="relative p-8 sm:p-12 rounded-2xl lg:rounded-3xl overflow-hidden"
                
              >
                {/* Hero Illustration - Replace the src with your AI-generated image hide this on mobile */}
                <img
                  src={heroImage}
                  alt="Premium Software Showcase"
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
                />

                {/* Fallback placeholder while image loads */}
                <noscript>
                  <div
                    className="w-full h-64 sm:h-80 lg:h-96 rounded-xl flex items-center justify-center font-poppins font-semibold text-lg sm:text-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.interactive.primary}30 0%, ${colors.interactive.primary}10 100%)`,
                      color: colors.text.secondary,
                    }}
                  >
                    Premium Software Showcase
                  </div>
                </noscript>
              </div>

            
            </div>
          </div>

          {/* ===== Features Grid (Desktop) ===== */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-2xl py-8 px-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                style={{
                  background: colors.background.secondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border.primary,
                }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                  {f.icon}
                </div>
                <div
                  className="text-2xl font-extrabold mb-1 font-sans"
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

          {/* ===== Features Carousel (Mobile) ===== */}
          <div className="sm:hidden w-full px-2">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentFeatureIndex * 100}%)`,
                }}
              >
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="w-full flex-shrink-0 px-1"
                  >
                    <div
                      className="flex flex-col items-center rounded-xl py-6 px-4 shadow-lg"
                      style={{
                        background: colors.background.secondary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colors.border.primary,
                      }}
                    >
                      <div className="mb-3">{f.icon}</div>
                      <div
                        className="text-2xl font-extrabold mb-1 font-sans"
                        style={{ color: colors.text.primary }}
                      >
                        {f.value}
                      </div>
                      <div
                        className="text-sm font-medium font-sans text-center"
                        style={{ color: colors.text.secondary }}
                      >
                        {f.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
