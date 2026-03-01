import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs, useDeleteBlog } from "../api/blogApi";
import { useUser } from "../api/userQueries";
import { Plus } from "lucide-react";
import {
  BlogPageLayout,
  BlogCard,
  BlogButton,
} from "../components/blog";

const BlogListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { data: user } = useUser();
  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
  const limit = 12;

  const { data, isLoading, error } = useBlogs({
    page,
    limit,
    status: "published",
  });

  const deleteBlogMutation = useDeleteBlog();

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlogMutation.mutateAsync(id);
        alert("Blog deleted successfully!");
      } catch (err: unknown) {
        const msg =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        alert(msg || "Failed to delete blog");
      }
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/blogs/edit/${id}`);
  };

  return (
    <BlogPageLayout maxWidth="7xl">
      {/* Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#1e293b]">
          Our Blog
        </h1>
        <p className="text-base md:text-lg mb-4 text-[#64748b]">
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

      {isLoading && (
        <div className="text-center py-20">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"
            aria-hidden
          />
          <p className="mt-6 text-xl font-semibold text-gray-600">
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
                isDeleting={deleteBlogMutation.isPending}
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
  );
};

export default BlogListPage;
