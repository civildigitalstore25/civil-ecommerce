import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  role: 'superadmin' | 'admin' | 'user';
  permissions?: string[]; // For admins: dashboard, users, products, categories, companies, orders, reviews, banners, coupons
  googleId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'user'],
    default: 'user',
  },
  permissions: {
    type: [String],
    default: [],
  },
  googleId: {
    type: String,
    sparse: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ resetPasswordToken: 1 });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;