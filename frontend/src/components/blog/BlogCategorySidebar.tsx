import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../../api/types/blogTypes";
import { blogTheme } from "./blogTheme";

type BlogCategorySidebarProps = {
  category: string;
  blogs: Blog[];
  className?: string;
};

/** Right-column reference links to other posts in the same category. */
export function BlogCategorySidebar({
  category,
  blogs,
  className = "",
}: BlogCategorySidebarProps): ReactElement | null {
  if (!blogs.length) return null;

  return (
    <aside
      className={`rounded-2xl border bg-white shadow-sm p-5 md:p-6 ${className}`.trim()}
      style={{ borderColor: blogTheme.border }}
      aria-labelledby="blog-category-sidebar-title"
    >
      <p
        className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] mb-2"
        style={{ color: blogTheme.textMuted }}
      >
        Keep reading
      </p>
      <h2
        id="blog-category-sidebar-title"
        className="text-base font-bold leading-snug mb-3"
        style={{ color: blogTheme.text }}
      >
        More in this category
      </h2>
      <p className="text-xs mb-5" style={{ color: blogTheme.textMuted }}>
        <span
          className="inline-block px-2.5 py-1 rounded-md font-semibold"
          style={{ backgroundColor: blogTheme.tagBg, color: blogTheme.tagText }}
        >
          {category}
        </span>
      </p>
      <nav aria-label={`Related articles in ${category}`}>
        <ol className="space-y-3 list-none m-0 p-0">
          {blogs.map((item, index) => (
            <li key={item._id} className="flex gap-2.5">
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: blogTheme.tagBg,
                  color: blogTheme.tagText,
                }}
                aria-hidden
              >
                {index + 1}
              </span>
              <Link
                to={`/blog/${item.slug}`}
                className="text-sm leading-snug font-medium transition-colors hover:underline pt-0.5"
                style={{ color: blogTheme.text }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = blogTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = blogTheme.text;
                }}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <Link
        to="/blog"
        className="mt-4 inline-block text-xs font-semibold transition-colors hover:underline"
        style={{ color: blogTheme.textMuted }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = blogTheme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = blogTheme.textMuted;
        }}
      >
        View all articles →
      </Link>
    </aside>
  );
}
