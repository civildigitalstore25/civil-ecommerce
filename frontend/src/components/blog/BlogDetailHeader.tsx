import { Eye, Clock } from "lucide-react";
import type { Blog } from "../../api/types/blogTypes";
import { BlogCategoryTag } from "./BlogCategoryTag";
import { BlogMeta } from "./BlogMeta";
import { estimateReadingTimeMinutes } from "./blogUtils";

type Props = {
  blog: Blog;
};

export function BlogDetailHeader({ blog }: Props) {
  const readMinutes = estimateReadingTimeMinutes(blog.content);
  const published = blog.publishedAt || blog.createdAt;

  return (
    <header className="mb-8 md:mb-10 max-w-3xl">
      <div className="mb-4">
        <BlogCategoryTag category={blog.category} />
      </div>
      <h1 className="font-poppins text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.625rem] font-bold text-slate-900 tracking-tight leading-[1.15] mb-5">
        {blog.title}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-5 border-b border-slate-200/90">
        <BlogMeta
          author={blog.author}
          authorAvatarUrl={blog.authorAvatarUrl}
          date={published}
          className="text-slate-600"
        />
        <span className="hidden sm:inline text-slate-300" aria-hidden>
          |
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" aria-hidden />
          <span>
            {readMinutes} min read
          </span>
        </span>
        {typeof blog.viewCount === "number" && blog.viewCount > 0 ? (
          <>
            <span className="hidden sm:inline text-slate-300" aria-hidden>
              |
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
              <Eye className="w-4 h-4 text-blue-600 shrink-0" aria-hidden />
              <span>
                <span className="font-semibold text-slate-800">
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
