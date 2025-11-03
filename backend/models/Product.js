"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const subscriptionDurationSchema = new mongoose_1.Schema({
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    priceINR: { type: Number },
    priceUSD: { type: Number }
}, { _id: false });
const faqSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
}, { _id: false });
const featureSchema = new mongoose_1.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });
const requirementSchema = new mongoose_1.Schema({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    version: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String, required: true },
    overallFeatures: { type: String },
    requirements: { type: String },
    keyFeatures: [featureSchema],
    systemRequirements: [requirementSchema],
    category: { type: String, required: true },
    company: { type: String, required: true }, // Backward compatibility
    brand: { type: String }, // New field
    price1: { type: Number, required: true }, // Backward compatibility
    price3: { type: Number }, // Backward compatibility
    priceLifetime: { type: Number }, // Backward compatibility
    // Dual currency pricing
    price1INR: { type: Number },
    price1USD: { type: Number },
    price3INR: { type: Number },
    price3USD: { type: Number },
    priceLifetimeINR: { type: Number },
    priceLifetimeUSD: { type: Number },
    subscriptionDurations: [subscriptionDurationSchema],
    subscriptions: [subscriptionDurationSchema], // Separate subscription plans for admin use
    hasLifetime: { type: Boolean, default: false },
    lifetimePrice: { type: Number },
    lifetimePriceINR: { type: Number },
    lifetimePriceUSD: { type: Number },
    hasMembership: { type: Boolean, default: false },
    membershipPrice: { type: Number },
    membershipPriceINR: { type: Number },
    membershipPriceUSD: { type: Number },
    image: { type: String, required: true }, // Backward compatibility
    imageUrl: { type: String }, // New field
    additionalImages: [{ type: String }],
    videoUrl: { type: String },
    activationVideoUrl: { type: String },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    isBestSeller: { type: Boolean, default: false },
    faqs: [faqSchema],
}, { timestamps: true });
exports.default = mongoose_1.default.model('Product', productSchema);
