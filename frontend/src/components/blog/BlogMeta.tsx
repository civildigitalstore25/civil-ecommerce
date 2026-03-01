import React from "react";
import { User as UserIcon, Calendar } from "lucide-react";
import { formatBlogDate, formatBlogDateShort } from "./blogUtils";

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
  const isSm = size === "sm";
  const iconClass = isSm ? "w-3 h-3" : "w-4 h-4";
  const textClass = isSm ? "text-xs" : "text-sm";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-gray-600 ${textClass} ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <UserIcon className={iconClass} aria-hidden />
        <span className="font-medium">{author}</span>
      </div>
      <span className="text-gray-400" aria-hidden>
        •
      </span>
      <div className="flex items-center gap-1.5">
        <Calendar className={iconClass} aria-hidden />
        <span>{isSm ? formatBlogDateShort(date) : formatBlogDate(date)}</span>
      </div>
    </div>
  );
}
