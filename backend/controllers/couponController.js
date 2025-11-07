"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCoupon = exports.validateCoupon = exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.getCoupons = void 0;
const Coupon_1 = __importDefault(require("../models/Coupon"));
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon_1.default.find().sort({ createdAt: -1 });
        res.json(coupons);
    }
    catch (err) {
        console.error('Error fetching coupons:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getCoupons = getCoupons;
const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findById(req.params.id);
        if (!coupon)
            return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    }
    catch (err) {
        console.error('Error fetching coupon:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getCoupon = getCoupon;
const createCoupon = async (req, res) => {
    try {
        const existingCoupon = await Coupon_1.default.findOne({ code: req.body.code });
        if (existingCoupon)
            return res.status(400).json({ message: 'Coupon code already exists' });
        // Ensure date string is converted to Date object
        req.body.validFrom = new Date(req.body.validFrom);
        req.body.validTo = new Date(req.body.validTo);
        const coupon = new Coupon_1.default(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    }
    catch (err) {
        console.error('Error creating coupon:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(400).json({ message: err.message || 'Failed to create coupon' });
    }
};
exports.createCoupon = createCoupon;
const updateCoupon = async (req, res) => {
    try {
        if (req.body.code) {
            const existingCoupon = await Coupon_1.default.findOne({ code: req.body.code, _id: { $ne: req.params.id } });
            if (existingCoupon)
                return res.status(400).json({ message: 'Coupon code already exists' });
        }
        // Ensure date string is converted to Date object
        if (req.body.validFrom)
            req.body.validFrom = new Date(req.body.validFrom);
        if (req.body.validTo)
            req.body.validTo = new Date(req.body.validTo);
        const coupon = await Coupon_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon)
            return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    }
    catch (err) {
        console.error('Error updating coupon:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(400).json({ message: err.message || 'Failed to update coupon' });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon_1.default.findByIdAndDelete(req.params.id);
        if (!coupon)
            return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting coupon:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.deleteCoupon = deleteCoupon;
// Validate and apply coupon
const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code || !subtotal) {
            return res.status(400).json({ message: 'Coupon code and subtotal are required' });
        }
        // Find coupon by code (case-insensitive)
        const coupon = await Coupon_1.default.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }
        // Check if coupon is active
        if (coupon.status !== 'Active') {
            return res.status(400).json({ message: 'This coupon is no longer active' });
        }
        // Check validity dates
        const now = new Date();
        if (now < coupon.validFrom) {
            return res.status(400).json({ message: 'This coupon is not yet valid' });
        }
        if (now > coupon.validTo) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }
        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon validity expired - usage limit reached' });
        }
        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'Percentage') {
            discountAmount = (subtotal * coupon.discountValue) / 100;
        }
        else {
            discountAmount = coupon.discountValue;
        }
        // Ensure discount doesn't exceed subtotal
        discountAmount = Math.min(discountAmount, subtotal);
        res.json({
            success: true,
            coupon: {
                code: coupon.code,
                name: coupon.name,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discountAmount: discountAmount,
                remainingUses: coupon.usageLimit - coupon.usedCount,
            }
        });
    }
    catch (err) {
        console.error('Error validating coupon:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.validateCoupon = validateCoupon;
// Apply coupon (increment usage count)
const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }
        // Find coupon by code (case-insensitive)
        const coupon = await Coupon_1.default.findOne({ code: code.toUpperCase() });
        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }
        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon validity expired - usage limit reached' });
        }
        // Increment usage count
        coupon.usedCount += 1;
        // Auto-deactivate if usage limit reached
        if (coupon.usedCount >= coupon.usageLimit) {
            coupon.status = 'Inactive';
        }
        await coupon.save();
        res.json({
            success: true,
            message: 'Coupon applied successfully',
            coupon: {
                code: coupon.code,
                usedCount: coupon.usedCount,
                usageLimit: coupon.usageLimit,
                status: coupon.status,
            }
        });
    }
    catch (err) {
        console.error('Error applying coupon:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.applyCoupon = applyCoupon;
