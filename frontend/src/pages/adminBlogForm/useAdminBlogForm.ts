import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useUser } from "../../api/userQueries";
import { useCreateBlog, useUpdateBlog, useBlogById } from "../../api/blogApi";
import type { BlogFormData } from "../../api/types/blogTypes";

const emptyForm: BlogFormData = {
  title: "",
  content: "",
  excerpt: "",
  author: "",
  category: "",
  tags: [],
  featuredImage: "",
  youtubeVideoUrl: "",
  status: "published",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
};

export function useAdminBlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const isEditMode = Boolean(id);
  const { data: blogData } = useBlogById(id || "");
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  const [formData, setFormData] = useState<BlogFormData>(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && blogData?.blog) {
      const blog = blogData.blog;
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        excerpt: blog.excerpt || "",
        author: blog.author || "",
        category: blog.category || "",
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || "",
        youtubeVideoUrl: blog.youtubeVideoUrl || "",
        status: blog.status || "draft",
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        metaKeywords: blog.metaKeywords || [],
      });
    } else if (user && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        author: user.fullName || user.email,
      }));
    }
  }, [blogData, user, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.metaKeywords?.includes(keywordInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        metaKeywords: [...(prev.metaKeywords || []), keywordInput.trim()],
      }));
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords?.filter((kw) => kw !== keywordToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please enter a blog title" });
      return;
    }
    if (!formData.content?.trim()) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please enter blog content" });
      return;
    }
    if (!formData.excerpt?.trim()) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please enter a blog excerpt" });
      return;
    }
    if (!formData.category?.trim()) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please enter a blog category" });
      return;
    }
    if (!formData.featuredImage?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation",
        text: "Please enter a featured image URL",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateBlogMutation.mutateAsync({ id, data: formData });
        await Swal.fire({ icon: "success", title: "Success!", text: "Blog updated successfully!" });
      } else {
        await createBlogMutation.mutateAsync(formData);
        await Swal.fire({ icon: "success", title: "Success!", text: "Blog created successfully!" });
      }
      navigate("/blog");
    } catch (error: any) {
      console.error("Error saving blog:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to save blog. Please try again.";
      Swal.fire({ icon: "error", title: "Error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
