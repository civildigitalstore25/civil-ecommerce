import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { SiX } from "react-icons/si";
import * as LucideIcons from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  colors: ThemeColors;
  onShare: (platform: string) => void;
  onBuyNow: () => void;
  onWhatsAppEnquiry: () => void;
  showStickyCheckout: boolean;
};

const DESKTOP_SHARE_ICONS = [
  {
    platform: "whatsapp",
    title: "Share on WhatsApp",
    icon: FaWhatsapp,
    bgColor: "#25D366",
    hoverBgColor: "#20BA5A",
  },
  {
    platform: "facebook",
    title: "Share on Facebook",
    icon: FaFacebookF,
    bgColor: "#1877F2",
    hoverBgColor: "#166FE5",
  },
  {
    platform: "twitter",
    title: "Share on X",
    icon: SiX,
    bgColor: "#000000",
    hoverBgColor: "#14171A",
  },
  {
    platform: "linkedin",
    title: "Share on LinkedIn",
    icon: FaLinkedinIn,
    bgColor: "#0A66C2",
    hoverBgColor: "#0959A8",
  },
  {
    platform: "email",
    title: "Share via Email",
    icon: FaEnvelope,
    bgColor: "#4B5563",
    hoverBgColor: "#374151",
  },
] as const;

export const ProductDetailFloatingActions: React.FC<Props> = ({
  colors,
  onShare,
  onBuyNow,
  onWhatsAppEnquiry,
  showStickyCheckout,
}) => {
  return (
    <>
      <div
        className="fixed left-3 top-1/2 -translate-y-1/2 z-[9998] hidden md:flex flex-col space-y-3"
        aria-label="Share this product"
      >
        {DESKTOP_SHARE_ICONS.map(({ platform, title, icon: Icon, bgColor, hoverBgColor }) => (
          <button
            key={platform}
            type="button"
            onClick={() => onShare(platform)}
            title={title}
            aria-label={title}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
            style={{
              backgroundColor: bgColor,
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBgColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = bgColor;
            }}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {showStickyCheckout && (
        <div className="fixed right-3 top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 z-[9999] flex flex-col-reverse md:flex-row gap-2 md:gap-3 items-end">
          <button
            type="button"
            onClick={onBuyNow}
            className="hidden md:flex items-center rounded-full shadow-2xl px-4 py-2 lg:px-6 lg:py-3 bg-[var(--buy-now-color,#2563eb)] hover:bg-[var(--buy-now-hover,#1d4ed8)] transition-all duration-300 gap-2 md:gap-3"
            style={{
              backgroundColor: colors.interactive.primary,
              boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
              color: "#fff",
              border: `1.5px solid ${colors.interactive.primary}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                colors.interactive.primaryHover || colors.interactive.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.interactive.primary;
            }}
            title="Buy Now"
            aria-label="Buy Now"
          >
            <LucideIcons.Zap size={24} className="w-7 md:h-7 lg:w-8 lg:h-8" />
            <div className="flex flex-col items-start">
              <span className="text-white font-bold text-base lg:text-lg leading-none">Buy Now</span>
              <span className="text-white text-xs lg:text-sm leading-none opacity-80">
                Instant Checkout
              </span>
            </div>
          </button>
          <button
            type="button"
            onClick={onWhatsAppEnquiry}
            className="flex items-center rounded-full shadow-2xl px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-[#25D366] hover:bg-[#20BA5A] transition-all duration-300 gap-2 md:gap-3"
            style={{ boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)" }}
            title="WhatsApp Enquiry"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp size={24} className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" color="#fff" />
            <div className="flex flex-col items-start">
              <span className="text-white font-bold text-sm md:text-base lg:text-lg leading-none">
                Whatsapp
              </span>
              <span className="text-white text-xs md:text-xs lg:text-sm leading-none opacity-80">
                click to chat
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
