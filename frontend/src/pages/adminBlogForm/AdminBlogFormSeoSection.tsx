import type { BlogFormData } from "../../api/types/blogTypes";

interface Props {
  formData: BlogFormData;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  keywordInput: string;
  setKeywordInput: (v: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (kw: string) => void;
}

export function AdminBlogFormSeoSection({
  formData,
  handleChange,
  keywordInput,
  setKeywordInput,
  onAddKeyword,
  onRemoveKeyword,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">SEO Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Leave empty to use blog title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={3}
            placeholder="SEO description for search engines"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Meta Keywords</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), onAddKeyword())
              }
              placeholder="Add a keyword and press Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={onAddKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.metaKeywords?.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => onRemoveKeyword(keyword)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
