"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCoupon = exports.getCoupons = void 0;
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
