import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogs, useDeleteBlog } from "../api/blogApi";
import { useUser } from "../api/userQueries";
import { Pencil, Trash2, Plus, Calendar, User as UserIcon } from "lucide-react";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlogMutation.mutateAsync(id);
        alert("Blog deleted successfully!");
      } catch (error: any) {
        alert(error?.response?.data?.message || "Failed to delete blog");
      }
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/blogs/edit/${id}`);
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-200 pt-24 pb-12 px-2 md:px-4"
      style={{ backgroundColor: '#f9fafb' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
            Our Blog
          </h1>
          <p className="text-base md:text-lg mb-4" style={{ color: '#64748b' }}>
            Insights, tutorials, and news from our team
          </p>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/blogs/create")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Blog
            </button>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
            <p className="mt-6 text-xl font-semibold text-gray-600 dark:text-gray-400">
              Loading blogs...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Error Loading Blogs</h3>
            </div>
            <p>{(error as any)?.message || "Unknown error occurred. Please try again later."}</p>
          </div>
        )}

        {data && data.blogs.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <svg className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
              No Blogs Found
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              Check back later for new content!
            </p>
          </div>
        )}

        {data && data.blogs.length > 0 && (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
              {data.blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-lg md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-2 md:p-5 flex flex-col hover:scale-[1.02] bg-white border border-gray-200"
                >
                  {/* Image */}
                  <div
                    className="rounded-md md:rounded-xl overflow-hidden h-28 md:h-40 mb-2 md:mb-3 cursor-pointer transition-colors duration-200 relative bg-gray-100 flex items-center justify-center"
                    onClick={() => navigate(`/blog/${blog.slug}`)}
                  >
                    <img
                      src={blog.featuredImage}
                      alt={blog.title}
                      className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-1.5 md:mb-2">
                    <span className="text-[9px] md:text-xs px-1.5 md:px-3 py-0.5 md:py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {blog.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-[11px] md:text-lg font-semibold mb-1 md:mb-2 transition-colors duration-200 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/blog/${blog.slug}`)}
                  >
                    {blog.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-[9px] md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 flex-1">
                    {truncateText(blog.excerpt, 100)}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-1 md:gap-2 text-[8px] md:text-xs text-gray-500 mb-2 md:mb-3 pb-2 md:pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <UserIcon className="w-2 h-2 md:w-3 md:h-3" />
                      <span className="truncate max-w-[60px] md:max-w-none">{blog.author}</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-0.5 md:gap-1">
                      <Calendar className="w-2 h-2 md:w-3 md:h-3" />
                      <span className="hidden md:inline">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-1.5 md:gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/blog/${blog.slug}`)}
                      className="w-full font-bold rounded-md md:rounded-lg py-1.5 md:py-2 text-[10px] md:text-base transition-all duration-200 hover:scale-[1.02] bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"
                    >
                      Read More
                    </button>

                    {isAdmin && (
                      <div className="flex gap-1.5 md:gap-2">
                        <button
                          onClick={(e) => handleEdit(blog._id, e)}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 hover:scale-[1.02] text-[10px] md:text-base"
                          title="Edit Blog"
                        >
                          <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden md:inline">Edit</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(blog._id, blog.title, e)}
                          disabled={deleteBlogMutation.isPending}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg font-semibold transition-all flex items-center justify-center gap-1 md:gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-[10px] md:text-base"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden md:inline">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-3">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-all font-semibold border border-gray-300"
                >
                  ← Previous
                </button>
                <div className="flex gap-2">
                  {Array.from(
                    { length: Math.min(5, data.pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
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
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.totalPages}
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 hover:text-white transition-all font-semibold border border-gray-300"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
