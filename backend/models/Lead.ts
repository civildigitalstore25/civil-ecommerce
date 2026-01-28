import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
    name: string;
    email: string;
    whatsappNumber: string;
    discountCode: string;
    couponUsed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const leadSchema = new Schema<ILead>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true
    },
    discountCode: {
        type: String,
        required: true,
        unique: true
    },
    couponUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
leadSchema.index({ email: 1 });
leadSchema.index({ discountCode: 1 });

export default mongoose.model<ILead>('Lead', leadSchema);
