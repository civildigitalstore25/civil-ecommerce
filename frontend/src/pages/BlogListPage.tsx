import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { usePublishedBlogs, useDraftBlogs, useDeleteBlog, usePublishBlog } from "../api/blogApi";
import { useUser } from "../api/userQueries";
import { Plus } from "lucide-react";
import {
  BlogPageLayout,
  BlogCard,
  BlogButton,
} from "../components/blog";
import { getBlogListSEO, buildCanonicalUrl } from "../utils/seo";
import { useAdminTheme } from "../contexts/AdminThemeContext";

const BlogListPage: React.FC = () => {
  const { colors } = useAdminTheme();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"published" | "draft">("published");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const listSeo = getBlogListSEO();

  const { data: user } = useUser();
  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
  const limit = 12;

  const publishedQuery = usePublishedBlogs({
    page,
    limit,
  });
  const draftQuery = useDraftBlogs(
    {
      page,
      limit,
    },
    { enabled: Boolean(isAdmin && activeTab === "draft") },
  );

  const data = activeTab === "draft" ? draftQuery.data : publishedQuery.data;
  const isLoading = activeTab === "draft" ? draftQuery.isLoading : publishedQuery.isLoading;
  const error = activeTab === "draft" ? draftQuery.error : publishedQuery.error;

  const deleteBlogMutation = useDeleteBlog();
  const publishBlogMutation = usePublishBlog();

  const handleTabChange = (tab: "published" | "draft") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Blog?",
      text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteBlogMutation.mutateAsync(id);
      await Swal.fire({ icon: "success", title: "Deleted!", text: "Blog deleted successfully." });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      Swal.fire({ icon: "error", title: "Delete Failed", text: msg || "Failed to delete blog." });
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/blogs/edit/${id}`);
  };

  const handlePublish = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await Swal.fire({
      icon: "question",
      title: "Publish draft?",
      text: "This will make the blog visible to all users.",
      showCancelButton: true,
      confirmButtonText: "Publish",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await publishBlogMutation.mutateAsync(id);
      setActiveTab("published");
      setPage(1);
      await Swal.fire({
        icon: "success",
        title: "Published",
        text: "Blog published successfully.",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Publish Failed",
        text: error?.response?.data?.message || "Failed to publish blog.",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{listSeo.title}</title>
        <meta name="description" content={listSeo.description} />
        <meta name="keywords" content={listSeo.keywords} />
        <meta property="og:title" content={listSeo.ogTitle ?? listSeo.title} />
        <meta property="og:description" content={listSeo.ogDescription ?? listSeo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl(pathname)} />
        <meta name="twitter:title" content={listSeo.ogTitle ?? listSeo.title} />
        <meta name="twitter:description" content={listSeo.ogDescription ?? listSeo.description} />
        <link rel="canonical" href={buildCanonicalUrl(pathname)} />
      </Helmet>
      <BlogPageLayout maxWidth="7xl">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2 transition-colors duration-200"
          style={{ color: colors.text.primary }}
        >
          Our Blog
        </h1>
        <p
          className="text-base md:text-lg mb-4 transition-colors duration-200"
          style={{ color: colors.text.secondary }}
        >
          Insights, tutorials, and news from our team
        </p>
        {isAdmin && (
          <BlogButton
            variant="primary"
            className="inline-flex items-center gap-2 px-6 py-3 shadow-lg"
            onClick={() => navigate("/admin/blogs/create")}
          >
            <Plus className="w-5 h-5" />
            Add New Blog
          </BlogButton>
        )}
      </div>

      {isAdmin && (
        <div className="flex justify-center mb-6 md:mb-8">
          <div
            className="inline-flex rounded-full p-1 border shadow-sm"
            style={{
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange("published")}
              className="px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all"
              style={{
                backgroundColor: activeTab === "published" ? colors.interactive.primary : "transparent",
                color: activeTab === "published" ? "#fff" : colors.text.primary,
              }}
            >
              Published Blogs
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("draft")}
              className="px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-all"
              style={{
                backgroundColor: activeTab === "draft" ? colors.interactive.primary : "transparent",
                color: activeTab === "draft" ? "#fff" : colors.text.primary,
              }}
            >
              Draft Blogs
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-20">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"
            aria-hidden
          />
          <p className="mt-6 text-xl font-semibold" style={{ color: colors.text.secondary }}>
            Loading blogs...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 p-8 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold">Error Loading Blogs</h3>
          </div>
          <p>{(error as Error)?.message || "Unknown error occurred. Please try again later."}</p>
        </div>
      )}

      {data && data.blogs.length === 0 && (
        <div className="bg-gray-50 rounded-xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
          <svg
            className="w-24 h-24 mx-auto mb-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-2xl font-bold text-gray-600 mb-3">No Blogs Found</p>
          <p className="text-gray-500">Check back later for new content!</p>
        </div>
      )}

      {data && data.blogs.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {data.blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                showActions
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
                onPublish={isAdmin ? handlePublish : undefined}
                isDeleting={deleteBlogMutation.isPending}
                showStatusBadge={Boolean(isAdmin)}
              />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-3 flex-wrap">
              <BlogButton
                variant="secondary"
                className="px-6 py-3 shadow-lg"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                ← Previous
              </BlogButton>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.min(5, data.pagination.totalPages) },
                  (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`w-12 h-12 rounded-lg shadow-lg transition-all font-bold border-2 ${
                          page === pageNum
                            ? "bg-blue-600 text-white border-blue-600 shadow-xl"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
              <BlogButton
                variant="secondary"
                className="px-6 py-3 shadow-lg"
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
              >
                Next →
              </BlogButton>
            </div>
          )}
        </>
      )}
    </BlogPageLayout>
    </>
  );
};

export default BlogListPage;
