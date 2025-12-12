import React, { useState, useEffect } from "react";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

import {
  UserGroupIcon,
  CloudArrowDownIcon,
  ShieldCheckIcon,
  StarIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BoltIcon,
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
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);



  // Auto-play carousel for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="pt-0 pb-0 px-2 sm:pt-0 sm:pb-20 sm:px-6 transition-colors duration-300"
      style={{
        background:
          theme === "light"
            ? colors.background.primary
            : colors.background.primary,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ===== Banner Carousel ===== */}
        <BannerCarousel page="home" />

        {/* ===== Hero Content ===== */}
        <div className="flex flex-col items-center mt-6 sm:mt-12">
          <h1
            className="text-2xl sm:text-5xl font-poppins mb-3 sm:mb-6 tracking-wide leading-tight sm:leading-snug text-center px-2"
            style={{ color: colors.text.primary }}
          >
            SoftzCart — Ebooks for  Engineers
          </h1>

          <p
            className="mb-4 sm:mb-12 text-sm sm:text-xl font-lato leading-relaxed text-center max-w-2xl px-4"
            style={{ color: colors.text.secondary }}
          >
            Find curated ebooks, software manuals, and technical guides for 
            engineering. SoftzCart offers authentic ebook content with instant
            delivery and lifetime support — only ebooks are shown here.
          </p>

          <button
            onClick={() => (window.location.href = "/category?brand=ebook")}
            className="px-5 py-2 sm:px-8 sm:py-4 rounded-md sm:rounded-lg font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mb-6 sm:mb-16"
            style={{
              background: colors.interactive.primary,
              color: colors.text.inverse,
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.interactive.primaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.interactive.primary;
            }}
          >
            Explore Ebooks
          </button>

          {/* ===== Features Grid (Desktop) ===== */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full mb-12">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-2xl py-7 px-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                style={{
                  background: colors.background.secondary,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: colors.border.primary,
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

          {/* ===== Features Carousel (Mobile) ===== */}
          <div className="sm:hidden w-full mb-6 px-2">
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
                      className="flex flex-col items-center rounded-xl py-5 px-4 shadow-lg"
                      style={{
                        background: colors.background.secondary,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: colors.border.primary,
                      }}
                    >
                      <div className="mb-2 scale-75">{f.icon}</div>
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

          {/* ===== Payment Info ===== */}
          <div
            className="flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-6 sm:gap-y-2 justify-center text-xs sm:text-sm font-medium font-sans px-2 mb-0"
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
