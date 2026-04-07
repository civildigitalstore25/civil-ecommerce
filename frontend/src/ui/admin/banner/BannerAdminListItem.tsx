import { Edit3, Trash, Calendar, ExternalLink } from "lucide-react";
import type { Banner } from "../../../types/Banner";
import type { ThemeColors, ThemeMode } from "../../../contexts/AdminThemeContext";
import type { CSSProperties } from "react";
import { truncateBannerText } from "./bannerAdminUtils";

interface BannerAdminListItemProps {
  banner: Banner;
  index: number;
  colors: ThemeColors;
  theme: ThemeMode;
  cardStyle: (variant?: "primary" | "secondary") => CSSProperties;
  onEdit: (b: Banner) => void;
  onDelete: (id: string) => void;
}

export function BannerAdminListItem({
  banner: b,
  index: idx,
  colors,
  theme,
  cardStyle,
  onEdit,
  onDelete,
}: BannerAdminListItemProps) {
  return (
    <div
      className="relative rounded-xl p-4 sm:p-6 flex flex-col justify-between gap-4 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
      style={{
        ...cardStyle("secondary"),
        border: `1px solid ${colors.interactive.primary}`,
        backgroundColor: colors.background.secondary,
        transitionDelay: `${idx * 50}ms`,
      }}
    >
      <div className="absolute top-3 right-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-end items-end">
        <span
          className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
          style={{
            backgroundColor: colors.interactive.primary + "20",
            color: colors.interactive.primary,
            borderColor: colors.interactive.primary + "40",
          }}
        >
          {b.bannerType}
        </span>

        <span
          className="font-mono font-semibold px-3 py-1 rounded-full text-sm border"
          style={{
            backgroundColor:
              b.status === "Active"
                ? theme === "light"
                  ? "#10b981"
                  : colors.status.success
                : colors.background.tertiary,
            color: b.status === "Active" ? "#fff" : colors.text.primary,
            borderColor:
              b.status === "Active"
                ? theme === "light"
                  ? "#10b981"
                  : colors.status.success
                : colors.border.primary,
          }}
        >
          {b.status}
        </span>
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        <h3
          className="text-lg sm:text-xl font-bold"
          style={{ color: colors.text.primary }}
        >
          {b.title}
        </h3>
        <p
          className="text-sm sm:text-base"
          style={{ color: colors.text.secondary }}
        >
          {truncateBannerText(b.description, 100)}
        </p>

        <div className="flex flex-wrap justify-between items-center mt-3 gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar size={14} />
              <span style={{ color: colors.text.secondary }}>
                {new Date(b.startDate).toLocaleDateString()} —{" "}
                {new Date(b.endDate).toLocaleDateString()}
              </span>
            </div>
            <span
              className="hidden sm:inline"
              style={{ color: colors.border.primary }}
            >
              |
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <ExternalLink size={14} />
              <span
                className="font-semibold"
                style={{ color: colors.text.secondary }}
              >
                Priority: {b.priority}/10
              </span>
            </div>
            <span
              className="hidden sm:inline"
              style={{ color: colors.border.primary }}
            >
              |
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-medium" style={{ color: colors.text.secondary }}>
                Position: {b.position}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(b)}
              className="p-2 rounded-full border hover:opacity-80 transition"
              style={{
                backgroundColor: "transparent",
                color: colors.interactive.primary,
                borderColor: colors.interactive.primary,
                borderWidth: "1px",
              }}
              title="Edit banner"
            >
              <Edit3 size={16} />
            </button>

            <button
              type="button"
              onClick={() => b._id && onDelete(b._id)}
              className="p-2 rounded-full border hover:opacity-80 transition"
              style={{
                backgroundColor: "transparent",
                color: colors.status.error,
                borderColor: colors.status.error,
                borderWidth: "1px",
              }}
              title="Delete banner"
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
