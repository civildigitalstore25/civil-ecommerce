import React from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Blog } from "../../api/types/blogTypes";
import { BlogCategoryTag } from "./BlogCategoryTag";
import { BlogMeta } from "./BlogMeta";
import { BlogButton } from "./BlogButton";
import { truncateText } from "./blogUtils";

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
  const isCompact = variant === "compact";

  const imageHeightClass = isCompact
    ? "h-28 md:h-40 rounded-t-lg"
    : "h-32 md:h-36 rounded-t-lg";

  const cardContent = (
    <>
      <Link
        to={`/blog/${blog.slug}`}
        className={`block overflow-hidden bg-gray-100 cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${imageHeightClass}`}
      >
        <img
          src={blog.featuredImage || PLACEHOLDER_IMAGE}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
      </Link>

      <div className={isCompact ? "p-4" : "p-3 md:p-4 flex flex-col flex-1 min-h-0"}>
        <div className={`flex flex-wrap gap-1.5 mb-1 ${isCompact ? "mb-2" : ""}`}>
          <BlogCategoryTag category={blog.category} />
        </div>

        <Link to={`/blog/${blog.slug}`} className="block">
          <h2
            className={`font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors leading-snug ${isCompact
                ? "text-base mb-2"
                : "text-sm md:text-base mb-1"
              }`}
          >
            {blog.title}
          </h2>
        </Link>

        <p
          className={`text-gray-600 line-clamp-2 leading-snug ${isCompact
              ? "text-sm mb-3"
              : "text-xs md:text-sm mb-2"
            }`}
        >
          {truncateText(blog.excerpt, excerptLength)}
        </p>

        <BlogMeta
          author={blog.author}
          date={blog.publishedAt || blog.createdAt}
          size={isCompact ? "sm" : "sm"}
          className={isCompact ? "mb-3" : "mb-3 text-xs"}
        />

        {!isCompact && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] md:text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {showActions && !isCompact && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
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
                  className="flex items-center justify-center w-9 h-9 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shrink-0"
                  aria-label="Edit blog"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => onDelete?.(blog._id, blog.title, e)}
                  disabled={isDeleting}
                  title="Delete"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Delete blog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isCompact) {
    return (
      <Link
        to={`/blog/${blog.slug}`}
        className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex flex-col bg-white border border-gray-200 overflow-hidden">
      {cardContent}
    </div>
  );
}
