import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlogBySlug, useRelatedBlogs } from "../api/blogApi";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useBlogBySlug(slug || "");
  const { data: relatedBlogsData } = useRelatedBlogs(slug || "", 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
          <p className="mt-6 text-xl font-semibold text-gray-600 dark:text-gray-400">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:scale-105 transition-all font-semibold shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog List
          </Link>
        </div>
      </div>
    );
  }

  const blog = data.blog;

  return (
    <div
      className="min-h-screen transition-colors duration-200 pt-24 pb-12 px-2 md:px-4"
      style={{ backgroundColor: '#f9fafb' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back to Blog Button */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold shadow-md border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg inline-block mb-4">
            {blog.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>
          </div>
          
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-6 flex justify-center">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto rounded-2xl shadow-2xl object-contain"
                style={{ maxHeight: '350px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <article className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Excerpt */}
                <div className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-3 mb-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-r-lg">
                  {blog.excerpt}
                </div>

                {/* YouTube Video Player */}
                {blog.youtubeVideoUrl && getYouTubeVideoId(blog.youtubeVideoUrl) && (
                  <div className="mb-8">
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.youtubeVideoUrl)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4 prose-headings:mt-8
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                    prose-strong:text-gray-900
                    prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:shadow-xl
                    prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8
                    prose-ul:my-6 prose-ol:my-6
                    prose-li:my-2"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t-2 border-gray-200">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-800">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Related Tags
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {blog.tags.map((tag) => (
                        <Link
                          key={tag}
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold hover:scale-110 hover:shadow-lg transition-all"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share this article
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          blog.title
                        )}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg hover:scale-105 transition-all font-semibold shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                        Twitter
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg hover:scale-105 transition-all font-semibold shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                        Facebook
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg hover:scale-105 transition-all font-semibold shadow-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Blogs Section */}
            {relatedBlogsData?.blogs && relatedBlogsData.blogs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1e293b' }}>
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedBlogsData.blogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog._id}
                      to={`/blog/${relatedBlog.slug}`}
                      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="h-28 md:h-40 overflow-hidden bg-gray-100">
                        {relatedBlog.featuredImage && (
                          <img
                            src={relatedBlog.featuredImage}
                            alt={relatedBlog.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mb-2">
                          {relatedBlog.category}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {relatedBlog.excerpt}
                        </p>
                        <div className="text-xs text-gray-500">
                          {new Date(relatedBlog.publishedAt || relatedBlog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
  );
};

export default BlogDetailPage;
