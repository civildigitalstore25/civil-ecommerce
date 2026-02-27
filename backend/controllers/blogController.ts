import { Request, Response } from 'express';
import Blog, { IBlog } from '../models/Blog';
import { IUser } from '../models/User';

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Create new blog post (Admin only)
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const blogData = { ...req.body };

    // Generate slug from title if not provided
    if (!blogData.slug && blogData.title) {
      blogData.slug = generateSlug(blogData.title);
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: blogData.slug });
    if (existingBlog) {
      blogData.slug = `${blogData.slug}-${Date.now()}`;
    }

    // Set author information
    if (!blogData.author && user) {
      blogData.author = user.fullName || user.email;
      blogData.authorId = user._id;
    }

    const blog = new Blog(blogData);
    const savedBlog = await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog: savedBlog,
    });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create blog',
    });
  }
};

// Get all blogs with filters (Public & Admin)
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      tag,
      search,
      sortBy = 'publishedAt',
      order = 'desc',
    } = req.query;

    const filter: any = {};
    const user = (req as any).user as IUser;

    // Only show published blogs to non-admin users
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      filter.status = 'published';
    } else if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select('-content'), // Exclude full content in list view
      Blog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBlogs: total,
        blogsPerPage: limitNum,
      },
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch blogs',
    });
  }
};

// Get single blog by slug (Public & Admin)
export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const user = (req as any).user as IUser;

    const filter: any = { slug };

    // Only show published blogs to non-admin users
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      filter.status = 'published';
    }

    const blog = await Blog.findOne(filter);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch blog',
    });
  }
};

// Get single blog by ID (Admin only)
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error: any) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch blog',
    });
  }
};

// Update blog (Admin only)
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If title is updated, regenerate slug
    if (updateData.title && !updateData.slug) {
      const newSlug = generateSlug(updateData.title);
      const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingBlog) {
        updateData.slug = `${newSlug}-${Date.now()}`;
      } else {
        updateData.slug = newSlug;
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update blog',
    });
  }
};

// Delete blog (Admin only)
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete blog',
    });
  }
};

// Get blog categories (Public)
export const getBlogCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const filter: any = {};

    // Only count published blogs for non-admin users
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      filter.status = 'published';
    }

    const categories = await Blog.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories',
    });
  }
};

// Get popular tags (Public)
export const getPopularTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const filter: any = {};

    // Only count published blogs for non-admin users
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      filter.status = 'published';
    }

    const tags = await Blog.aggregate([
      { $match: filter },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { tag: '$_id', count: 1, _id: 0 } },
    ]);

    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tags',
    });
  }
};

// Get featured/recent blogs (Public)
export const getFeaturedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit as string, 10);

    const blogs = await Blog.find({ status: 'published' })
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(limitNum)
      .select('-content');

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error: any) {
    console.error('Error fetching featured blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch featured blogs',
    });
  }
};
