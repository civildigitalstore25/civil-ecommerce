import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogBySlug, useRelatedBlogs } from "../api/blogApi";
import {
  BlogPageLayout,
  BlogButton,
  BlogCategoryTag,
  BlogMeta,
  BlogShareSection,
  BlogCard,
  getYouTubeVideoId,
} from "../components/blog";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useBlogBySlug(slug || "");
  const { data: relatedBlogsData } = useRelatedBlogs(slug || "", 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <BlogPageLayout maxWidth="5xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div
              className="inline-block w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
              aria-hidden
            />
            <p className="mt-4 text-sm font-medium text-gray-500">Loading article...</p>
          </div>
        </div>
      </BlogPageLayout>
    );
  }

  if (error || !data?.blog) {
    return (
      <BlogPageLayout maxWidth="5xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h1>
            <p className="text-gray-500 text-sm mb-6">
              This post may have been removed or the link is incorrect.
            </p>
            <BlogButton variant="primary" to="/blog" className="px-5 py-2.5 text-sm">
              Back to Blog
            </BlogButton>
          </div>
        </div>
      </BlogPageLayout>
    );
  }

  const blog = data.blog;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <BlogPageLayout maxWidth="5xl">
      {/* Back link */}
      <nav className="mb-6 md:mb-8" aria-label="Breadcrumb">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </nav>

      <article className="mb-16">
        {/* Hero image */}
        {blog.featuredImage && (
          <div className="rounded-xl overflow-hidden bg-gray-100 mb-8 shadow-sm aspect-[2/1] max-h-[420px]">
            <img
              src={blog.featuredImage}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-10">
          <div className="mb-3">
            <BlogCategoryTag category={blog.category} />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-tight mb-4">
            {blog.title}
          </h1>
          <BlogMeta
            author={blog.author}
            date={blog.publishedAt || blog.createdAt}
            className="text-gray-500"
          />
        </header>

        {/* Content card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* Lead / Excerpt */}
          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-6 border-b border-gray-100">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
              {blog.excerpt}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 md:px-10 py-8 md:py-10">
            {/* YouTube embed */}
            {blog.youtubeVideoUrl && getYouTubeVideoId(blog.youtubeVideoUrl) && (
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Video</p>
                <div className="relative w-full rounded-xl overflow-hidden bg-gray-900 shadow-lg" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.youtubeVideoUrl)}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Article body */}
            <div
              className="blog-article-body prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                prose-headings:mt-10 prose-headings:mb-4 prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-600 prose-p:leading-[1.75] prose-p:mb-6
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900
                prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:my-1.5
                prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Tags + Share footer */}
          <div className="px-6 md:px-10 py-6 md:py-8 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {blog.tags.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 mr-1">Tags</span>
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : (
              <span />
            )}
            <BlogShareSection title={blog.title} url={shareUrl} />
          </div>
        </div>
      </article>

      {/* Related */}
      {relatedBlogsData?.blogs && relatedBlogsData.blogs.length > 0 && (
        <section className="pt-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Related articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBlogsData.blogs.map((relatedBlog) => (
              <BlogCard
                key={relatedBlog._id}
                blog={relatedBlog}
                showActions={false}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}
    </BlogPageLayout>
  );
};

export default BlogDetailPage;
