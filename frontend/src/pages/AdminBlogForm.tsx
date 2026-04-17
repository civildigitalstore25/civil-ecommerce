import React from "react";
import { useAdminBlogForm } from "./adminBlogForm/useAdminBlogForm";
import { AdminBlogFormBasicSection } from "./adminBlogForm/AdminBlogFormBasicSection";
import { AdminBlogFormSeoSection } from "./adminBlogForm/AdminBlogFormSeoSection";

const AdminBlogForm: React.FC = () => {
  const {
    user,
    isEditMode,
    formData,
    setFormData,
    tagInput,
    setTagInput,
    keywordInput,
    setKeywordInput,
    isSubmitting,
    handleChange,
    handleAddTag,
    handleRemoveTag,
    handleAddKeyword,
    handleRemoveKeyword,
    handleSubmit,
    navigate,
  } = useAdminBlogForm();

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">Access denied: Admin only</div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AdminBlogFormBasicSection
              formData={formData}
              handleChange={handleChange}
              onContentChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              tagInput={tagInput}
              setTagInput={setTagInput}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
            <AdminBlogFormSeoSection
              formData={formData}
              handleChange={handleChange}
              keywordInput={keywordInput}
              setKeywordInput={setKeywordInput}
              onAddKeyword={handleAddKeyword}
              onRemoveKeyword={handleRemoveKeyword}
            />
          </div>

          <div className="p-6 border-t border-gray-200 bg-white rounded-b-lg flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/blog")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update Blog" : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBlogForm;
