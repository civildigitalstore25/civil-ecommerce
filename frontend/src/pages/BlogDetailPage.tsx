import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useBlogBySlug, useRelatedBlogs } from "../api/blogApi";
import {
  BlogPageLayout,
  BlogButton,
  BlogDetailBreadcrumb,
  BlogDetailHeader,
  BlogDetailHeroImage,
  BlogDetailArticleContent,
  BlogCategorySidebar,
} from "../components/blog";
import { BLOG_CATEGORY_SIDEBAR_LINK_LIMIT } from "../constants/blog";
import { getBlogDetailSEO, buildCanonicalUrl } from "../utils/seo";

function BlogDetailLoading() {
  return (
    <BlogPageLayout maxWidth="5xl">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="inline-block w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
          <p className="mt-4 text-sm font-medium text-slate-500">Loading article…</p>
        </div>
      </div>
    </BlogPageLayout>
  );
}

function BlogDetailNotFound() {
  return (
    <BlogPageLayout maxWidth="5xl">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-2xl text-red-500" aria-hidden>
              ✕
            </span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Article not found</h1>
          <p className="text-slate-500 text-sm mb-6">
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

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useBlogBySlug(slug || "");
  const { data: categoryBlogsData } = useRelatedBlogs(
    slug || "",
    BLOG_CATEGORY_SIDEBAR_LINK_LIMIT,
  );
  const slugPath = slug ? `/blog/${slug}` : "/blog";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Blog | Softzcart</title>
          <meta name="description" content="Loading article on Softzcart." />
          <link rel="canonical" href={buildCanonicalUrl(slugPath)} />
        </Helmet>
        <BlogDetailLoading />
      </>
    );
  }

  if (error || !data?.blog) {
    return (
      <>
        <Helmet>
          <title>Article not found | Softzcart</title>
          <meta
            name="description"
            content="This blog post could not be found. Browse our blog for software guides and news."
          />
          <link rel="canonical" href={buildCanonicalUrl("/blog")} />
        </Helmet>
        <BlogDetailNotFound />
      </>
    );
  }

  const blog = data.blog;
  const detailSeo = getBlogDetailSEO(blog);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <Helmet>
        <title>{detailSeo.title}</title>
        <meta name="description" content={detailSeo.description} />
        <meta name="keywords" content={detailSeo.keywords} />
        <meta property="og:title" content={detailSeo.ogTitle ?? detailSeo.title} />
        <meta property="og:description" content={detailSeo.ogDescription ?? detailSeo.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={detailSeo.canonicalUrl} />
        {detailSeo.ogImage ? <meta property="og:image" content={detailSeo.ogImage} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={detailSeo.ogTitle ?? detailSeo.title} />
        <meta name="twitter:description" content={detailSeo.ogDescription ?? detailSeo.description} />
        {detailSeo.ogImage ? <meta name="twitter:image" content={detailSeo.ogImage} /> : null}
        <link rel="canonical" href={detailSeo.canonicalUrl} />
      </Helmet>

      <BlogPageLayout maxWidth="7xl">
        <BlogDetailBreadcrumb category={blog.category} />

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] gap-8 xl:gap-12 items-start">
          <article className="min-w-0">
            {blog.featuredImage ? (
              <BlogDetailHeroImage src={blog.featuredImage} alt={blog.title} />
            ) : null}
            <BlogDetailHeader blog={blog} />
            <BlogDetailArticleContent blog={blog} shareUrl={shareUrl} />
          </article>

          {categoryBlogsData?.blogs && categoryBlogsData.blogs.length > 0 ? (
            <BlogCategorySidebar
              category={blog.category}
              blogs={categoryBlogsData.blogs}
              className="lg:sticky lg:top-28"
            />
          ) : null}
        </div>
      </BlogPageLayout>
    </>
  );
};

export default BlogDetailPage;
