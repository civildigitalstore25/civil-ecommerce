import { Eye, Clock } from "lucide-react";
import type { Blog } from "../../api/types/blogTypes";
import { BlogCategoryTag } from "./BlogCategoryTag";
import { BlogMeta } from "./BlogMeta";
import { estimateReadingTimeMinutes } from "./blogUtils";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

type Props = {
  blog: Blog;
};

export function BlogDetailHeader({ blog }: Props) {
  const { colors } = useAdminTheme();
  const readMinutes = estimateReadingTimeMinutes(blog.content);
  const published = blog.publishedAt || blog.createdAt;

  return (
    <header className="mb-7 md:mb-10 max-w-3xl">
      <div className="mb-3 sm:mb-4">
        <BlogCategoryTag category={blog.category} />
      </div>
      <h1
        className="font-poppins text-[1.25rem] sm:text-3xl md:text-4xl lg:text-[2.625rem] font-bold tracking-tight leading-[1.22] sm:leading-[1.15] mb-4 sm:mb-5"
        style={{ color: colors.text.primary }}
      >
        {blog.title}
      </h1>
      <div
        className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 pb-4 sm:pb-5 border-b"
        style={{ borderColor: colors.border.primary }}
      >
        <BlogMeta
          author={blog.author}
          authorAvatarUrl={blog.authorAvatarUrl}
          date={published}
          className=""
        />
        <span className="hidden sm:inline" style={{ color: colors.text.secondary }} aria-hidden>
          |
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" aria-hidden />
          <span>
            {readMinutes} min read
          </span>
        </span>
        {typeof blog.viewCount === "number" && blog.viewCount > 0 ? (
          <>
            <span className="hidden sm:inline" style={{ color: colors.text.secondary }} aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" aria-hidden />
              <span>
                <span className="font-semibold" style={{ color: colors.text.primary }}>
                  {blog.viewCount.toLocaleString()}
                </span>{" "}
                {blog.viewCount === 1 ? "view" : "views"}
              </span>
            </span>
          </>
        ) : null}
      </div>
    </header>
  );
}
