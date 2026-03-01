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
  /** Show Read more + optional Edit/Delete (for list page) */
  showActions?: boolean;
  /** Show Edit button (admin) */
  onEdit?: (id: string, e: React.MouseEvent) => void;
  /** Show Delete button (admin) */
  onDelete?: (id: string, title: string, e: React.MouseEvent) => void;
  isDeleting?: boolean;
  /** Excerpt max length */
  excerptLength?: number;
  /** Compact layout for related posts */
  variant?: "default" | "compact";
}

export function BlogCard({
  blog,
  showActions = true,
  onEdit,
  onDelete,
  isDeleting = false,
  excerptLength = 100,
  variant = "default",
}: BlogCardProps): React.ReactElement {
  const isCompact = variant === "compact";

  const cardContent = (
    <>
      <Link
        to={`/blog/${blog.slug}`}
        className={`block overflow-hidden bg-gray-100 cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${
          isCompact ? "h-28 md:h-40 rounded-t-lg" : "h-28 md:h-40 mb-2 md:mb-3 rounded-md md:rounded-xl"
        }`}
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

      <div className={isCompact ? "p-4" : "p-2 md:p-5 flex flex-col flex-1"}>
        <div className={`flex flex-wrap gap-2 mb-1.5 md:mb-2 ${isCompact ? "mb-2" : ""}`}>
          <BlogCategoryTag category={blog.category} />
        </div>

        <Link to={`/blog/${blog.slug}`} className="block">
          <h2
            className={`font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors ${
              isCompact
                ? "text-base mb-2"
                : "text-[11px] md:text-lg mb-1 md:mb-2 min-h-[2.5rem] md:min-h-[3rem]"
            }`}
          >
            {blog.title}
          </h2>
        </Link>

        <p
          className={`text-gray-600 flex-1 ${
            isCompact
              ? "text-sm line-clamp-2 mb-3"
              : "text-[9px] md:text-sm mb-2 md:mb-3 line-clamp-2"
          }`}
        >
          {truncateText(blog.excerpt, excerptLength)}
        </p>

        <BlogMeta
          author={blog.author}
          date={blog.publishedAt || blog.createdAt}
          size={isCompact ? "sm" : "md"}
          className={isCompact ? "mb-3" : "mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-200"}
        />

        {!isCompact && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {showActions && !isCompact && (
          <div className="flex flex-col gap-1.5 md:gap-2 mt-auto">
            <BlogButton
              variant="primary"
              className="w-full py-1.5 md:py-2 text-[10px] md:text-base"
              to={`/blog/${blog.slug}`}
            >
              Read More
            </BlogButton>
            {onEdit != null && (
              <div className="flex gap-1.5 md:gap-2">
                <BlogButton
                  variant="outline"
                  className="flex-1 py-1.5 md:py-2 text-[10px] md:text-base"
                  onClick={(e) => onEdit(blog._id, e)}
                  title="Edit Blog"
                >
                  <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Edit</span>
                </BlogButton>
                <BlogButton
                  variant="danger"
                  className="flex-1 py-1.5 md:py-2 text-[10px] md:text-base"
                  onClick={(e) => onDelete?.(blog._id, blog.title, e)}
                  disabled={isDeleting}
                  title="Delete Blog"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden md:inline">Delete</span>
                </BlogButton>
              </div>
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
        className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col bg-white border border-gray-200 overflow-hidden">
      {cardContent}
    </div>
  );
}
