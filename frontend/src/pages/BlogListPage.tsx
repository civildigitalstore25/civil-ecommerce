import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlogs, useBlogCategories, usePopularTags, useDeleteBlog } from "../api/blogApi";
import { useUser } from "../api/userQueries";
import { Pencil, Trash2, Eye, Plus, Calendar, User as UserIcon } from "lucide-react";

const BlogListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const { data: user } = useUser();
  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
  
  const limit = 9;

  const { data, isLoading, error } = useBlogs({
    page,
    limit,
    category: categoryFilter || undefined,
    tag: tagFilter || undefined,
    search: searchTerm || undefined,
    status: "published",
  });

  const { data: categoriesData } = useBlogCategories();
  const { data: tagsData } = usePopularTags();
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
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#1e293b' }}>
            Our Blog
          </h1>
          <p className="text-base md:text-lg mb-4" style={{ color: '#64748b' }}>
            Insights, tutorials, and news from our team
          </p>
          {isAdmin && (
            <Link
              to="/admin/blogs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:scale-105"
              style={{ marginTop: 8 }}
            >
              <Plus className="w-5 h-5" />
              Add New Blog
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6 border border-gray-200 dark:border-gray-700">
              {/* Search */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Blogs
                </h3>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 transition-all"
                />
              </div>

              {/* Categories */}
              {categoriesData && categoriesData.categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setCategoryFilter("");
                        setPage(1);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                        !categoryFilter
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>All Categories</span>
                        <span className="text-sm opacity-75">
                          {categoriesData.categories.reduce((sum, cat) => sum + cat.count, 0)}
                        </span>
                      </span>
                    </button>
                    {categoriesData.categories.map((cat) => (
                      <button
                        key={cat.category}
                        onClick={() => {
                          setCategoryFilter(cat.category);
                          setPage(1);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex justify-between items-center font-medium ${
                          categoryFilter === cat.category
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span>{cat.category}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          categoryFilter === cat.category
                            ? "bg-white/20"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tagsData && tagsData.tags.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsData.tags.map((tagItem) => (
                      <button
                        key={tagItem.tag}
                        onClick={() => {
                          setTagFilter(tagItem.tag);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                          tagFilter === tagItem.tag
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        #{tagItem.tag}
                      </button>
                    ))}
                    {tagFilter && (
                      <button
                        onClick={() => {
                          setTagFilter("");
                          setPage(1);
                        }}
                        className="px-3 py-1.5 rounded-full text-sm bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105 shadow-md font-medium"
                      >
                        × Clear Tag
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Active Filters */}
            {(categoryFilter || tagFilter || searchTerm) && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-md p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Active Filters:
                  </span>
                  {categoryFilter && (
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md flex items-center gap-2">
                      Category: {categoryFilter}
                      <button
                        onClick={() => setCategoryFilter("")}
                        className="hover:bg-blue-700 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {tagFilter && (
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold shadow-md flex items-center gap-2">
                      Tag: #{tagFilter}
                      <button
                        onClick={() => setTagFilter("")}
                        className="hover:bg-purple-700 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold shadow-md flex items-center gap-2">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="hover:bg-green-700 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setTagFilter("");
                      setSearchTerm("");
                      setPage(1);
                    }}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold ml-auto underline decoration-2 underline-offset-2"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
                <p className="mt-6 text-xl font-semibold text-gray-600 dark:text-gray-400">
                  Loading amazing blogs...
                </p>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 p-8 rounded-xl shadow-lg">
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
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <svg className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
                  No Blogs Found
                </p>
                <p className="text-gray-500 dark:text-gray-500 mb-6">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                {(categoryFilter || tagFilter || searchTerm) && (
                  <button
                    onClick={() => {
                      setCategoryFilter("");
                      setTagFilter("");
                      setSearchTerm("");
                      setPage(1);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:scale-105 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}

            {data && data.blogs.length > 0 && (
              <>
                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <Link to={`/blog/${blog.slug}`}>
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                        </Link>
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                            {blog.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {blog.viewCount}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <Link to={`/blog/${blog.slug}`}>
                          <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[56px]">
                            {blog.title}
                          </h2>
                        </Link>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                          {truncateText(blog.excerpt, 120)}
                        </p>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            <span className="font-medium">{blog.author}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          </div>
                        </div>
                        
                        {blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            View Blog
                          </Link>
                          
                          {isAdmin && (
                            <>
                              <button
                                onClick={(e) => handleEdit(blog._id, e)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md"
                                title="Edit Blog"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => handleDelete(blog._id, blog.title, e)}
                                disabled={deleteBlogMutation.isPending}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete Blog"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
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
                      className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all font-semibold border border-gray-300 dark:border-gray-700 hover:scale-105"
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
                              className={`w-12 h-12 rounded-lg shadow-lg transition-all font-bold border-2 hover:scale-110 ${
                                page === pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-xl scale-110"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-700"
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
                      className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all font-semibold border border-gray-300 dark:border-gray-700 hover:scale-105"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
