import express from 'express';
import {
  createBlog,
  getBlogs,
  getPublishedBlogs,
  getDraftBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  publishBlog,
  deleteBlog,
  getBlogCategories,
  getPopularTags,
  getFeaturedBlogs,
  getRelatedBlogs,
} from '../controllers/blogController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get(['/blog', '/blogs'], getBlogs); // Get all published blogs (or all for admin)
router.get(['/blog/published', '/blogs/published'], getPublishedBlogs); // Public published-only blogs
router.get(['/blog/featured', '/blogs/featured'], getFeaturedBlogs); // Get featured/popular blogs
router.get(['/blog/categories', '/blogs/categories'], getBlogCategories); // Get all categories with counts
router.get(['/blog/tags', '/blogs/tags'], getPopularTags); // Get popular tags
router.get(['/blog/slug/:slug', '/blogs/slug/:slug'], getBlogBySlug); // Get single blog by slug
router.get(['/blog/slug/:slug/related', '/blogs/slug/:slug/related'], getRelatedBlogs); // Get related blogs by category

// Admin routes (Protected)
router.post(['/blog', '/blogs', '/blog/create', '/blogs/create'], authenticate, requireAdmin, createBlog); // Create new blog
router.get(['/blog/:id', '/blogs/:id'], authenticate, requireAdmin, getBlogById); // Get blog by ID for editing
router.get(['/blog/drafts', '/blogs/drafts'], authenticate, requireAdmin, getDraftBlogs); // Get draft blogs
router.put(['/blog/:id', '/blogs/:id'], authenticate, requireAdmin, updateBlog); // Update blog
router.put(['/blog/:id/publish', '/blogs/:id/publish'], authenticate, requireAdmin, publishBlog); // Publish draft blog
router.delete(['/blog/:id', '/blogs/:id'], authenticate, requireAdmin, deleteBlog); // Delete blog

export default router;
