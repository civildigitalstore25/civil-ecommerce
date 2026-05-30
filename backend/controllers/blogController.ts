import { Request, Response } from 'express';
import Blog, { IBlog } from '../models/Blog';
import { IUser } from '../models/User';
import { resolveOptionalPagination } from '../utils/listPagination';
import { normalizeSlug as generateSlug } from '../utils/slug';

const isAdminUser = (user?: IUser | null): boolean =>
  Boolean(user && (user.role === 'admin' || user.role === 'superadmin'));

const normalizeOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeBlogPayload = (blogData: Record<string, unknown>): Record<string, unknown> => {
  const normalized = { ...blogData };

  if (typeof normalized.status !== 'string') {
    normalized.status = 'draft';
  }

  const slug = normalizeOptionalString(normalized.slug);
  if (slug) {
    normalized.slug = generateSlug(slug);
  } else {
    delete normalized.slug;
  }

  return normalized;
};

const requirePublishedFields = (blogData: Record<string, unknown>): string | null => {
  const title = normalizeOptionalString(blogData.title);
  if (!title) return 'Title is required';

  const content = normalizeOptionalString(blogData.content);
  if (!content) return 'Content is required';

  const excerpt = normalizeOptionalString(blogData.excerpt);
  if (!excerpt) return 'Excerpt is required';

  const category = normalizeOptionalString(blogData.category);
  if (!category) return 'Category is required';

  const featuredImage = normalizeOptionalString(blogData.featuredImage);
  if (!featuredImage) return 'Featured image is required';

  return null;
};

const resolveStatus = (value: unknown): 'draft' | 'published' =>
  value === 'published' ? 'published' : 'draft';

// Create new blog post (Admin only)
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;
    const blogData = normalizeBlogPayload({ ...req.body });
    const status = resolveStatus(blogData.status);

    if (status === 'published') {
      const validationError = requirePublishedFields(blogData);
      if (validationError) {
        res.status(400).json({
          success: false,
          message: validationError,
        });
        return;
      }
    }

    if (status === 'published' && !blogData.slug) {
      blogData.slug = generateSlug(String(blogData.title));
    }

    blogData.status = status;

    // Check if slug already exists
    if (blogData.slug) {
      const existingBlog = await Blog.findOne({ slug: blogData.slug });
      if (existingBlog) {
        blogData.slug = `${blogData.slug}-${Date.now()}`;
      }
    }

    // Set author information
    if (!blogData.author && user) {
      blogData.author = user.fullName || user.email;
      blogData.authorId = user._id;
    }

    if (status === 'published' && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
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
      status,
      category,
      tag,
      search,
      sortBy = 'publishedAt',
      order = 'desc',
    } = req.query;

    const filter: any = {};
    const user = (req as any).user as IUser;
    const isAdmin = isAdminUser(user);

    // Only show published blogs to non-admin users
    if (!isAdmin) {
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

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder;

    if (isAdmin) {
      const { paginate, page, limit, skip } = resolveOptionalPagination(req.query);
      let blogQuery = Blog.find(filter).sort(sortOptions).select('-content');
      if (paginate) {
        blogQuery = blogQuery.skip(skip).limit(limit);
      }
      const [blogs, total] = await Promise.all([blogQuery, Blog.countDocuments(filter)]);

      res.status(200).json({
        success: true,
        blogs,
        pagination: {
          currentPage: paginate ? page : 1,
          totalPages: paginate ? Math.ceil(total / limit) : 1,
          totalBlogs: total,
          blogsPerPage: paginate ? limit : total,
        },
      });
      return;
    }

    const pageNum = Math.max(parseInt(String(req.query.page), 10) || 1, 1);
    const limitNum = Math.max(parseInt(String(req.query.limit), 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select('-content'),
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

// Get published blogs only (Public)
export const getPublishedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag, search, sortBy = 'publishedAt', order = 'desc' } = req.query;

    const filter: any = { status: 'published' };

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

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder;

    const pageNum = Math.max(parseInt(String(req.query.page), 10) || 1, 1);
    const limitNum = Math.max(parseInt(String(req.query.limit), 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select('-content'),
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
    console.error('Error fetching published blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch published blogs',
    });
  }
};

// Get draft blogs (Admin only)
export const getDraftBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as IUser;

    if (!isAdminUser(user)) {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
      return;
    }

    const { paginate, page, limit, skip } = resolveOptionalPagination(req.query);
    let blogQuery = Blog.find({ status: 'draft' }).sort({ updatedAt: -1 }).select('-content');
    if (paginate) {
      blogQuery = blogQuery.skip(skip).limit(limit);
    }
    const [blogs, total] = await Promise.all([blogQuery, Blog.countDocuments({ status: 'draft' })]);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: paginate ? page : 1,
        totalPages: paginate ? Math.ceil(total / limit) : 1,
        totalBlogs: total,
        blogsPerPage: paginate ? limit : total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching draft blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch draft blogs',
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
    const updateData = normalizeBlogPayload({ ...req.body });

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    const nextStatus =
      typeof updateData.status === 'string'
        ? resolveStatus(updateData.status)
        : existingBlog.status === 'published'
          ? 'published'
          : 'draft';

    if (nextStatus === 'published') {
      const mergedData = {
        ...existingBlog.toObject(),
        ...updateData,
        status: nextStatus,
      } as Record<string, unknown>;
      const validationError = requirePublishedFields(mergedData);
      if (validationError) {
        res.status(400).json({
          success: false,
          message: validationError,
        });
        return;
      }
    }

    if (updateData.title && !updateData.slug) {
      const newSlug = generateSlug(String(updateData.title));
      const slugConflict = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      updateData.slug = slugConflict ? `${newSlug}-${Date.now()}` : newSlug;
    }

    if (updateData.slug) {
      const slugConflict = await Blog.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (slugConflict) {
        updateData.slug = `${String(updateData.slug)}-${Date.now()}`;
      }
    }

    updateData.status = nextStatus;
    if (nextStatus === 'published' && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
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

// Publish draft blog (Admin only)
export const publishBlog = async (req: Request, res: Response): Promise<void> => {
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

    const publishData = {
      status: 'published' as const,
      publishedAt: blog.publishedAt || new Date(),
    };

    if (!normalizeOptionalString(blog.title) || !normalizeOptionalString(blog.content) || !normalizeOptionalString(blog.excerpt) || !normalizeOptionalString(blog.category) || !normalizeOptionalString(blog.featuredImage)) {
      res.status(400).json({
        success: false,
        message: 'Draft must have title, content, excerpt, category, and featured image before publishing',
      });
      return;
    }

    if (!normalizeOptionalString(blog.slug) && normalizeOptionalString(blog.title)) {
      blog.slug = generateSlug(String(blog.title));
    }

    const slugConflict = blog.slug
      ? await Blog.findOne({ slug: blog.slug, _id: { $ne: id } })
      : null;
    if (slugConflict && blog.slug) {
      blog.slug = `${blog.slug}-${Date.now()}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...publishData, slug: blog.slug },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: 'Blog published successfully',
      blog: updatedBlog,
    });
  } catch (error: any) {
    console.error('Error publishing blog:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to publish blog',
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

// Get related blogs by category (Public)
export const getRelatedBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;
    const limitNum = parseInt(limit as string, 10);

    // First, get the current blog to find its category
    const currentBlog = await Blog.findOne({ slug, status: 'published' });
    
    if (!currentBlog) {
      res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
      return;
    }

    // Find other published blogs in the same category
    const relatedBlogs = await Blog.find({
      category: currentBlog.category,
      status: 'published',
      _id: { $ne: currentBlog._id }, // Exclude current blog
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limitNum)
      .select('-content'); // Exclude full content for performance

    res.status(200).json({
      success: true,
      blogs: relatedBlogs,
      category: currentBlog.category,
    });
  } catch (error: any) {
    console.error('Error fetching related blogs:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch related blogs',
    });
  }
};
