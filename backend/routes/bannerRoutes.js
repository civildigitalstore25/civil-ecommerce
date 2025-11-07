"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Banner_1 = __importDefault(require("../models/Banner"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// IMPORTANT: Stats route MUST come before /:id route to avoid conflicts
// Get banner statistics (admin only)
router.get('/stats/overview', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const [total, active, inactive, scheduled] = await Promise.all([
            Banner_1.default.countDocuments(),
            Banner_1.default.countDocuments({ status: 'Active' }),
            Banner_1.default.countDocuments({ status: 'Inactive' }),
            Banner_1.default.countDocuments({ status: 'Scheduled' })
        ]);
        const [normal, festival, flashSale, seasonal] = await Promise.all([
            Banner_1.default.countDocuments({ bannerType: 'Normal' }),
            Banner_1.default.countDocuments({ bannerType: 'Festival' }),
            Banner_1.default.countDocuments({ bannerType: 'Flash Sale' }),
            Banner_1.default.countDocuments({ bannerType: 'Seasonal' })
        ]);
        const [homePage, productPage, both] = await Promise.all([
            Banner_1.default.countDocuments({ position: 'Home Page Only' }),
            Banner_1.default.countDocuments({ position: 'Product Page' }),
            Banner_1.default.countDocuments({ position: 'Both' })
        ]);
        res.json({
            success: true,
            data: {
                total,
                active,
                inactive,
                scheduled,
                byType: {
                    normal,
                    festival,
                    flashSale,
                    seasonal
                },
                byPosition: {
                    homePage,
                    productPage,
                    both
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching banner stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});
// Bulk update status (admin only) - Must come before /:id
router.patch('/bulk-status', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const { bannerIds, status } = req.body;
        if (!bannerIds || !Array.isArray(bannerIds) || bannerIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid banner IDs'
            });
        }
        if (!['Active', 'Inactive', 'Scheduled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        const result = await Banner_1.default.updateMany({ _id: { $in: bannerIds } }, { $set: { status } });
        res.json({
            success: true,
            data: { modifiedCount: result.modifiedCount },
            message: `${result.modifiedCount} banner(s) updated successfully`
        });
    }
    catch (error) {
        console.error('Error bulk updating banners:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating banners'
        });
    }
});
// Get active banners for a specific position (public route)
router.get('/active/:position', async (req, res) => {
    try {
        const { position } = req.params;
        const now = new Date();
        const query = {
            status: 'Active',
            startDate: { $lte: now },
            endDate: { $gte: now },
        };
        // Filter by position
        if (position === 'home') {
            query.$or = [{ position: 'Home Page Only' }, { position: 'Both' }];
        }
        else if (position === 'product') {
            query.$or = [{ position: 'Product Page' }, { position: 'Both' }];
        }
        const banners = await Banner_1.default.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .limit(5);
        res.json({
            success: true,
            data: banners
        });
    }
    catch (error) {
        console.error('Error fetching active banners:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching banners'
        });
    }
});
// Get all banners (admin only)
router.get('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const banners = await Banner_1.default.find().sort({ priority: -1, createdAt: -1 });
        res.json({
            success: true,
            data: banners
        });
    }
    catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching banners'
        });
    }
});
// Get single banner (admin only)
router.get('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const banner = await Banner_1.default.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        res.json({
            success: true,
            data: banner
        });
    }
    catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching banner'
        });
    }
});
// Create banner (admin only)
router.post('/', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        // Validate dates
        const { startDate, endDate } = req.body;
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }
        const banner = new Banner_1.default(req.body);
        await banner.save();
        res.status(201).json({
            success: true,
            data: banner,
            message: 'Banner created successfully'
        });
    }
    catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating banner'
        });
    }
});
// Update banner (admin only)
router.put('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        // Validate dates if provided
        if (req.body.startDate && req.body.endDate) {
            if (new Date(req.body.startDate) >= new Date(req.body.endDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }
        const banner = await Banner_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        res.json({
            success: true,
            data: banner,
            message: 'Banner updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating banner'
        });
    }
});
// Delete banner (admin only)
router.delete('/:id', auth_1.authenticate, auth_1.requireAdmin, async (req, res) => {
    try {
        const banner = await Banner_1.default.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        res.json({
            success: true,
            message: 'Banner deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting banner'
        });
    }
});
exports.default = router;
