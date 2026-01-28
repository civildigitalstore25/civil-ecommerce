import mongoose, { Document, Schema } from 'mongoose';

export interface IMenu extends Document {
  name: string;
  slug: string;
  parentId: mongoose.Types.ObjectId | null;
  order: number;
  isActive: boolean;
  icon?: string;
  type: 'category' | 'subcategory' | 'brand';
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['category', 'subcategory', 'brand'],
      default: 'category',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MenuSchema.index({ parentId: 1, order: 1 });
MenuSchema.index({ slug: 1 });
MenuSchema.index({ isActive: 1 });

export default mongoose.model<IMenu>('Menu', MenuSchema);
