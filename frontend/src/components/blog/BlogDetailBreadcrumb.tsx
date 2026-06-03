import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { blogTheme } from "./blogTheme";

type Props = {
  category?: string;
};

export function BlogDetailBreadcrumb({ category }: Props) {
  return (
    <nav
      className="mb-6 md:mb-8 flex flex-wrap items-center gap-1.5 text-sm"
      aria-label="Breadcrumb"
    >
      <Link
        to="/blog"
        className="font-medium transition-colors hover:underline"
        style={{ color: blogTheme.textMuted }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = blogTheme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = blogTheme.textMuted;
        }}
      >
        Blog
      </Link>
      {category ? (
        <>
          <ChevronRight
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: blogTheme.textMuted }}
            aria-hidden
          />
          <span className="font-medium truncate max-w-[12rem] sm:max-w-none" style={{ color: blogTheme.text }}>
            {category}
          </span>
        </>
      ) : null}
      <ChevronRight
        className="w-3.5 h-3.5 shrink-0"
        style={{ color: blogTheme.textMuted }}
        aria-hidden
      />
      <span className="font-semibold" style={{ color: blogTheme.primary }}>
        Article
      </span>
    </nav>
  );
}
