"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Authentication required.'
            });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!decoded.userId) {
            res.status(401).json({
                success: false,
                message: 'Invalid token format'
            });
            return;
        }
        // Find user
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
            return;
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        else if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    }
};
exports.authenticate = authenticate;
/**
 * Admin authorization middleware
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
        return;
    }
    if (user.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Admin access required. Insufficient permissions.'
        });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Silently continue without user
        next();
    }
};
exports.optionalAuth = optionalAuth;
