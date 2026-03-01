import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId?: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  featuredImage: string;
  youtubeVideoUrl?: string;
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Title is required'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
      required: false,
    },
    author: {
      type: String,
      trim: true,
      required: false,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    category: {
      type: String,
      trim: true,
      required: false,
    },
    tags: [{
      type: String,
      trim: true,
      required: false,
    }],
    featuredImage: {
      type: String,
      required: false,
    },
    youtubeVideoUrl: {
      type: String,
      trim: true,
      required: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      required: false,
    },
    metaTitle: {
      type: String,
      trim: true,
      required: false,
    },
    metaDescription: {
      type: String,
      trim: true,
      required: false,
    },
    metaKeywords: [{
      type: String,
      trim: true,
      required: false,
    }],
    viewCount: {
      type: Number,
      default: 0,
      required: false,
    },
    publishedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ tags: 1 });

// Pre-save middleware to set publishedAt when status changes to published
BlogSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model<IBlog>('Blog', BlogSchema);
