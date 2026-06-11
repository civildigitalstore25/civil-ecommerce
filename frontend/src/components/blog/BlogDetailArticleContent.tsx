import { Link } from "react-router-dom";
import type { Blog } from "../../api/types/blogTypes";
import { BlogShareSection } from "./BlogShareSection";
import { getYouTubeVideoId } from "./blogUtils";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import "./blogArticle.css";

type Props = {
  blog: Blog;
  shareUrl: string;
};

export function BlogDetailArticleContent({ blog, shareUrl }: Props) {
  const { colors, theme } = useAdminTheme();
  const videoId = blog.youtubeVideoUrl
    ? getYouTubeVideoId(blog.youtubeVideoUrl)
    : null;
  const isDark = theme === "dark";

  return (
    <div
      className={`blog-detail-article ${
        isDark ? "blog-detail-article--dark" : ""
      } rounded-2xl border shadow-sm overflow-hidden`}
      style={{
        backgroundColor: colors.background.primary,
        borderColor: colors.border.primary,
      }}
    >
      {blog.excerpt ? (
        <div
          className="px-4 sm:px-6 md:px-10 lg:px-12 pt-6 sm:pt-8 md:pt-10 pb-6 md:pb-8 border-b"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <p className="blog-detail-article__lead max-w-3xl">{blog.excerpt}</p>
        </div>
      ) : null}

      <div className="px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-8 md:py-10 lg:py-12">
        {videoId ? (
          <section className="mb-10 md:mb-12 max-w-3xl" aria-labelledby="blog-video-heading">
            <p id="blog-video-heading" className="blog-detail-video-label mb-3">
              Featured video
            </p>
            <div
              className="relative w-full rounded-xl overflow-hidden bg-slate-900 shadow-lg ring-1 ring-slate-900/10"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`Video: ${blog.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}

        <div
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      <footer
        className="px-4 sm:px-6 md:px-10 lg:px-12 py-6 sm:py-7 md:py-8 border-t"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        }}
      >
        <div className="max-w-3xl flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {blog.tags.length > 0 ? (
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-2.5"
                style={{ color: colors.text.secondary }}
              >
                Topics
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(0, 104, 255, 0.16)"
                        : "#eff6ff",
                      borderColor: isDark
                        ? "rgba(96, 165, 250, 0.28)"
                        : "#dbeafe",
                      color: isDark ? "#dbeafe" : "#1e40af",
                    }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <span />
          )}
          <BlogShareSection title={blog.title} url={shareUrl} />
        </div>
      </footer>
    </div>
  );
}
