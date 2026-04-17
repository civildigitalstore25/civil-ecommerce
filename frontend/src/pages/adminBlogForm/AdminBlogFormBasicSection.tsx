import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import type { BlogFormData } from "../../api/types/blogTypes";

interface Props {
  formData: BlogFormData;
  handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  onContentChange: (value: string) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

export function AdminBlogFormBasicSection({
  formData,
  handleChange,
  onContentChange,
  tagInput,
  setTagInput,
  onAddTag,
  onRemoveTag,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter blog title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Excerpt *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            maxLength={300}
            required
            placeholder="Brief summary (max 300 characters)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Content *</label>
          <RichTextEditor
            value={formData.content}
            onChange={onContentChange}
            placeholder="Write your blog content here..."
            className="w-full"
            editorMinHeight="200px"
            editorMaxHeight="50vh"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g., Technology, Software, Tips"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Featured Image URL *</label>
          <input
            type="url"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          {formData.featuredImage && (
            <img
              src={formData.featuredImage}
              alt="Preview"
              className="mt-2 h-32 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            YouTube Video URL (Optional)
          </label>
          <input
            type="url"
            name="youtubeVideoUrl"
            value={formData.youtubeVideoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter a YouTube video URL to embed it in your blog post
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), onAddTag())}
              placeholder="Add a tag and press Enter"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="button"
              onClick={onAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </div>
  );
}
