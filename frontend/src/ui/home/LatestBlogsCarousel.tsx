import React from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../api/blogApi";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { truncateText } from "../../components/blog/blogUtils";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";

const LatestBlogsCarousel: React.FC = () => {
  const { colors } = useAdminTheme();

  const { data, isLoading, error } = useBlogs({
    page: 1,
    limit: 5,
    status: "published",
    sortBy: "publishedAt",
    order: "desc",
  });

  const blogs = data?.blogs ?? [];

  if (isLoading) {
    return (
      <section
        className="py-10 md:py-14"
        style={{
          background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl font-bold mb-6 transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            From Our Blog
          </h2>
          <div className="flex justify-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent"
              style={{ borderColor: colors.interactive.primary }}
              aria-hidden
            />
          </div>
        </div>
      </section>
    );
  }

  if (error || blogs.length === 0) {
    return null;
  }

  return (
    <section
      className="py-10 md:py-14"
      style={{
        background: `linear-gradient(120deg, ${colors.background.primary} 60%, ${colors.background.secondary} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2
            className="text-2xl md:text-3xl font-bold transition-colors duration-200"
            style={{ color: colors.text.primary }}
          >
            From Our Blog
          </h2>
          <Link
            to="/blog"
            className="text-sm font-semibold shrink-0 hover:underline"
            style={{ color: colors.interactive.primary }}
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog.slug}`}
              className="group flex flex-col h-full bg-white rounded-lg md:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-200 hover:scale-[1.02]"
            >
              <div
                className="rounded-t-lg md:rounded-t-2xl overflow-hidden h-32 md:h-52 flex items-center justify-center"
                style={{ backgroundColor: colors.background.secondary }}
              >
                <img
                  src={blog.featuredImage || PLACEHOLDER_IMAGE}
                  alt={blog.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <div className="p-2 md:p-4 flex flex-col flex-1 min-h-0">
                <span
                  className="text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 rounded-full w-fit"
                  style={{
                    backgroundColor: `${colors.interactive.primary}20`,
                    color: colors.interactive.primary,
                  }}
                >
                  {blog.category}
                </span>
                <h3 className="mt-1.5 md:mt-2 text-[11px] md:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                  {blog.title}
                </h3>
                <p className="mt-1 text-[10px] md:text-sm text-gray-600 line-clamp-2 leading-snug flex-1">
                  {truncateText(blog.excerpt, 60)}
                </p>
                <p className="mt-2 text-[10px] md:text-xs text-gray-500">
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsCarousel;
