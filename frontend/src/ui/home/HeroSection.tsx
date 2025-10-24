import React from "react";
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
  { icon: <DevicePhoneMobileIcon className="h-5 w-5 text-pink-500" />, label: "UPI & Mobile Payments" },
  { icon: <CreditCardIcon className="h-5 w-5 text-blue-600" />, label: "Secure Cards" },
  { icon: <BoltIcon className="h-5 w-5 text-yellow-400" />, label: "Instant Activation" },
];

const HeroSection: React.FC = () => {
  const { colors, theme } = useAdminTheme();

  const handleExploreProducts = () => {
    window.location.href = "/products";
  };

  return (
    <section
      className="py-14 px-4 sm:py-20 sm:px-6 transition-colors duration-300"
      style={{
        background: theme === "light"
          ? "linear-gradient(to bottom right, #f9fafb, #ffffff)"
          : "linear-gradient(to bottom right, #111827, #1f2937)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ===== Banner Carousel ===== */}
        <BannerCarousel page="home"  />

        {/* ===== Hero Content ===== */}
        <div className="flex flex-col items-center mt-12">
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

          <button
            onClick={handleExploreProducts}
            className="px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 mb-16"
            style={{
              backgroundColor: colors.interactive.primary,
              color: colors.text.inverse,
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

          {/* ===== Features Grid ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full mb-12">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center rounded-2xl py-7 px-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                style={{
                  backgroundColor: colors.background.secondary,
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

          {/* ===== Payment Info ===== */}
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