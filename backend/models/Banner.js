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
const BannerSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    ctaButtonText: {
        type: String,
        // required: true,
        default: 'Shop Now',
    },
    ctaButtonLink: {
        type: String,
        trim: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    position: {
        type: String,
        enum: ['Home Page Only', 'Product Page', 'Both'],
        default: 'Home Page Only',
        required: true,
    },
    bannerType: {
        type: String,
        enum: ['Normal', 'Festival', 'Flash Sale', 'Seasonal'],
        default: 'Normal',
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Scheduled'],
        default: 'Active',
    },
    backgroundColor: {
        type: String,
        default: '#3B82F6',
    },
    textColor: {
        type: String,
        default: '#FFFFFF',
    },
}, {
    timestamps: true,
});
// Index for efficient querying
BannerSchema.index({ status: 1, priority: -1, startDate: 1, endDate: 1 });
exports.default = mongoose_1.default.model('Banner', BannerSchema);
