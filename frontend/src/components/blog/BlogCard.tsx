import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Blog } from "../../api/types/blogTypes";
import { BlogCategoryTag } from "./BlogCategoryTag";
import { BlogMeta } from "./BlogMeta";
import { BlogButton } from "./BlogButton";
import { truncateText } from "./blogUtils";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

interface BlogCardProps {
  blog: Blog;
  showActions?: boolean;
  onEdit?: (id: string, e: React.MouseEvent) => void;
  onDelete?: (id: string, title: string, e: React.MouseEvent) => void;
  isDeleting?: boolean;
  excerptLength?: number;
  variant?: "default" | "compact";
}

export function BlogCard({
  blog,
  showActions = true,
  onEdit,
  onDelete,
  isDeleting = false,
  excerptLength = 80,
  variant = "default",
}: BlogCardProps): React.ReactElement {
  const { colors, theme } = useAdminTheme();
  const isCompact = variant === "compact";

  const cardShellStyle: React.CSSProperties = {
    background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
    border: `1.5px solid ${colors.border.primary}`,
    boxShadow:
      theme === "dark"
        ? "0 4px 24px rgba(0, 0, 0, 0.35)"
        : "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
  };

  const imageHeightClass = isCompact ? "h-28 md:h-40" : "h-32 md:h-52";

  const imageInner = (
    <img
      src={blog.featuredImage || PLACEHOLDER_IMAGE}
      alt={blog.title}
      className={`w-full h-full object-contain transition-transform duration-300 ${isCompact ? "group-hover:scale-105" : "group-hover/img:scale-105"}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
      }}
    />
  );

  const imageBlock =
    isCompact ? (
      <div
        className={`rounded-md md:rounded-xl overflow-hidden mb-2 md:mb-3 ${imageHeightClass} flex items-center justify-center`}
        style={{ backgroundColor: colors.background.secondary }}
      >
        {imageInner}
      </div>
    ) : (
      <div
        className={`rounded-md md:rounded-xl overflow-hidden mb-2 md:mb-3 ${imageHeightClass} flex items-center justify-center`}
        style={{ backgroundColor: colors.background.secondary }}
      >
        <Link to={`/blog/${blog.slug}`} className="block w-full h-full group/img">
          {imageInner}
        </Link>
      </div>
    );

  const titleBlock = isCompact ? (
    <h2
      className="font-semibold line-clamp-2 leading-snug text-base mb-2"
      style={{ color: colors.text.primary }}
    >
      {blog.title}
    </h2>
  ) : (
    <Link to={`/blog/${blog.slug}`} className="block group/title">
      <h2
        className="font-semibold line-clamp-2 cursor-pointer transition-opacity leading-snug text-sm md:text-base mb-1 group-hover/title:opacity-90"
        style={{ color: colors.text.primary }}
      >
        {blog.title}
      </h2>
    </Link>
  );

  const bodyBlock = (
    <div className={isCompact ? "px-1" : "flex flex-col flex-1 min-h-0"}>
      <div className={`flex flex-wrap gap-1.5 mb-1 ${isCompact ? "mb-2" : ""}`}>
        <BlogCategoryTag category={blog.category} />
      </div>

      {titleBlock}

      <p
        className={`line-clamp-2 leading-snug ${isCompact ? "text-sm mb-3" : "text-xs md:text-sm mb-2"}`}
        style={{ color: colors.text.secondary }}
      >
        {truncateText(blog.excerpt, excerptLength)}
      </p>

      <BlogMeta
        author={blog.author}
        date={blog.publishedAt || blog.createdAt}
        size="sm"
        className={isCompact ? "mb-3" : "mb-3 text-xs"}
      />

      {!isCompact && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {blog.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] md:text-xs px-2 py-0.5 rounded font-medium"
              style={{
                backgroundColor: colors.background.secondary,
                color: colors.text.secondary,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {showActions && !isCompact && (
        <div
          className="flex items-center gap-2 mt-auto pt-2 border-t"
          style={{ borderColor: colors.border.primary }}
        >
          <BlogButton
            variant="primary"
            className="flex-1 min-w-0 py-2 text-sm font-medium"
            to={`/blog/${blog.slug}`}
          >
            Read More
          </BlogButton>
          {onEdit != null && (
            <>
              <button
                type="button"
                onClick={(e) => onEdit(blog._id, e)}
                title="Edit"
                className="flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-colors shrink-0"
                style={{
                  borderColor: colors.interactive.primary,
                  color: colors.interactive.primary,
                }}
                aria-label="Edit blog"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => onDelete?.(blog._id, blog.title, e)}
                disabled={isDeleting}
                title="Delete"
                className="flex items-center justify-center w-9 h-9 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete blog"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (isCompact) {
    return (
      <Link
        to={`/blog/${blog.slug}`}
        className="group flex flex-col h-full rounded-lg md:rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02] p-2 md:p-4"
        style={cardShellStyle}
      >
        {imageBlock}
        {bodyBlock}
      </Link>
    );
  }

  return (
    <div
      className="rounded-lg md:rounded-2xl transition-all duration-200 flex flex-col overflow-hidden hover:scale-[1.02] p-2 md:p-5"
      style={cardShellStyle}
    >
      {imageBlock}
      {bodyBlock}
    </div>
  );
}
