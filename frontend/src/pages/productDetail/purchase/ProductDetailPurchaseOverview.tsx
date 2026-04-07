import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebookF, FaLinkedinIn, FaEnvelope } from "react-icons/fa";
import { SiX } from "react-icons/si";
import * as LucideIcons from "lucide-react";
import { PRODUCT_TRUST_BADGES } from "../../../constants/productTrustBadges";
import type { ProductDetailPurchaseOverviewProps } from "./types";

const MOBILE_SHARE_ICONS = [
  { platform: "whatsapp", title: "Share on WhatsApp", icon: FaWhatsapp, bgColor: "#25D366" },
  { platform: "facebook", title: "Share on Facebook", icon: FaFacebookF, bgColor: "#1877F2" },
  { platform: "twitter", title: "Share on X", icon: SiX, bgColor: "#000000" },
  { platform: "linkedin", title: "Share on LinkedIn", icon: FaLinkedinIn, bgColor: "#0A66C2" },
  { platform: "email", title: "Share via Email", icon: FaEnvelope, bgColor: "#4B5563" },
] as const;

export const ProductDetailPurchaseOverview: React.FC<ProductDetailPurchaseOverviewProps> = ({
  product,
  colors,
  reviewStats,
  onShare,
  totalViews,
  soldQuantity,
}) => {
  return (
    <>
      <div className="flex items-center gap-2 lg:gap-3">
        <span
          className="px-2 py-1 lg:px-3 lg:py-1 rounded-lg text-xs lg:text-sm font-bold transition-colors duration-200"
          style={{
            background: colors.interactive.primary,
            color: colors.text.inverse,
          }}
        >
          {(product.brand || product.company).charAt(0).toUpperCase() +
            (product.brand || product.company).slice(1)}
        </span>
        <span style={{ color: colors.interactive.primary }} className="text-sm">
          {product.version}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl lg:text-4xl font-bold flex-1" style={{ color: colors.text.primary }}>
          {product.name}
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <LucideIcons.Star
                key={i}
                size={16}
                fill={i < Math.floor(reviewStats?.averageRating || 0) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span style={{ color: colors.text.primary }}>
            {reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : "0.0"} (
            {reviewStats?.totalReviews || 0})
          </span>
        </div>
      </div>

      <div
        className="flex md:hidden items-center gap-2 mt-3 flex-wrap"
        aria-label="Share this product"
      >
        <span className="text-xs font-semibold mr-1" style={{ color: colors.text.secondary }}>
          Share:
        </span>
        {MOBILE_SHARE_ICONS.map(({ platform, title, icon: Icon, bgColor }) => (
          <button
            key={platform}
            type="button"
            onClick={() => onShare(platform)}
            title={title}
            aria-label={title}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-transform hover:scale-110 flex-shrink-0"
            style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
          >
            <Icon className="w-4 h-4" style={{ color: "#FFFFFF" }} />
          </button>
        ))}
      </div>

      {(totalViews > 0 || soldQuantity > 0) && (
        <div className="flex items-center gap-2 mt-3 flex-nowrap overflow-x-auto">
          {totalViews > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap shrink-0"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.interactive.primary + "40",
                color: colors.text.primary,
              }}
            >
              <div className="flex items-center gap-1">
                <LucideIcons.Eye size={18} style={{ color: colors.interactive.primary }} />
                <span className="font-semibold" style={{ color: colors.interactive.primary }}>
                  {totalViews.toLocaleString()}
                </span>
              </div>
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                {totalViews === 1 ? "Total view" : "Total views"}
              </span>
            </div>
          )}
          {soldQuantity > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 whitespace-nowrap shrink-0"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.interactive.secondary + "40",
                color: colors.text.primary,
              }}
            >
              <div className="flex items-center gap-1">
                <LucideIcons.ShoppingCart size={18} style={{ color: colors.interactive.secondary }} />
                <span className="font-semibold" style={{ color: colors.interactive.secondary }}>
                  {soldQuantity.toLocaleString()}
                </span>
              </div>
              <span className="text-sm" style={{ color: colors.text.secondary }}>
                {soldQuantity === 1 ? "Unit sold" : "Units sold"}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRODUCT_TRUST_BADGES.map((badge) => {
          const Icon =
            badge.icon === "truck"
              ? LucideIcons.Truck
              : badge.icon === "support"
                ? LucideIcons.Headphones
                : LucideIcons.ShieldCheck;
          return (
            <div
              key={badge.title}
              className="flex items-start gap-3 rounded-xl border p-3 lg:p-4 transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <div
                className="mt-0.5 rounded-lg p-2"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.interactive.primary,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: colors.text.primary }}>
                  {badge.title}
                </div>
                <div className="text-xs lg:text-sm" style={{ color: colors.text.secondary }}>
                  {badge.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
