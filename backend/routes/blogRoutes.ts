import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogCategories,
  getPopularTags,
  getFeaturedBlogs,
} from '../controllers/blogController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.get('/blogs', getBlogs); // Get all published blogs (or all for admin)
router.get('/blogs/featured', getFeaturedBlogs); // Get featured/popular blogs
router.get('/blogs/categories', getBlogCategories); // Get all categories with counts
router.get('/blogs/tags', getPopularTags); // Get popular tags
router.get('/blogs/slug/:slug', getBlogBySlug); // Get single blog by slug

// Admin routes (Protected)
router.post('/blogs', authenticate, requireAdmin, createBlog); // Create new blog
router.get('/blogs/:id', authenticate, requireAdmin, getBlogById); // Get blog by ID for editing
router.put('/blogs/:id', authenticate, requireAdmin, updateBlog); // Update blog
router.delete('/blogs/:id', authenticate, requireAdmin, deleteBlog); // Delete blog

export default router;
