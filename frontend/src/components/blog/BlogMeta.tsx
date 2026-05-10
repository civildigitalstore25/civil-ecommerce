import React from "react";
import { User as UserIcon, Calendar } from "lucide-react";
import { formatBlogDate, formatBlogDateShort } from "./blogUtils";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

interface BlogMetaProps {
  author: string;
  date: string;
  size?: "sm" | "md";
  className?: string;
}

export function BlogMeta({
  author,
  date,
  size = "md",
  className = "",
}: BlogMetaProps): React.ReactElement {
  const { colors } = useAdminTheme();
  const isSm = size === "sm";
  const iconClass = isSm ? "w-3 h-3" : "w-4 h-4";
  const textClass = isSm ? "text-xs" : "text-sm";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${textClass} ${className}`}
      style={{ color: colors.text.secondary }}
    >
      <div className="flex items-center gap-1.5">
        <UserIcon className={iconClass} aria-hidden style={{ color: colors.text.secondary }} />
        <span className="font-medium">{author}</span>
      </div>
      <span style={{ color: colors.text.secondary, opacity: 0.65 }} aria-hidden>
        •
      </span>
      <div className="flex items-center gap-1.5">
        <Calendar className={iconClass} aria-hidden style={{ color: colors.text.secondary }} />
        <span>{isSm ? formatBlogDateShort(date) : formatBlogDate(date)}</span>
      </div>
    </div>
  );
}
