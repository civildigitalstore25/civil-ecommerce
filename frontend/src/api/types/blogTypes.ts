export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId?: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  author?: string;
  category: string;
  tags: string[];
  featuredImage: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface BlogsResponse {
  success: boolean;
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    blogsPerPage: number;
  };
}

export interface BlogResponse {
  success: boolean;
  blog: Blog;
}

export interface BlogCategoriesResponse {
  success: boolean;
  categories: Array<{
    category: string;
    count: number;
  }>;
}

export interface BlogTagsResponse {
  success: boolean;
  tags: Array<{
    tag: string;
    count: number;
  }>;
}
