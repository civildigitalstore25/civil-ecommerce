"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactSubmissions = exports.submitContactForm = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const emailService_1 = __importDefault(require("../services/emailService"));
const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        // Input validation
        if (!name || !email || !subject) {
            res.status(400).json({ message: 'Name, email, and subject are required' });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: 'Please provide a valid email address' });
            return;
        }
        // Save to database
        const contact = new Contact_1.default({
            name,
            email,
            subject,
            message: message || 'No message provided'
        });
        const savedContact = await contact.save();
        // Send email notification
        try {
            await emailService_1.default.sendContactFormEmail(name, email, subject, message || 'No message provided');
            res.status(201).json({
                message: 'Contact form submitted successfully. We will get back to you soon!',
                success: true
            });
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Still respond successfully since data was saved
            res.status(201).json({
                message: 'Contact form submitted successfully (email notification failed). We will get back to you soon!',
                success: true
            });
        }
    }
    catch (error) {
        console.error('Contact form submission error:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
    }
};
exports.submitContactForm = submitContactForm;
const getContactSubmissions = async (req, res) => {
    try {
        // Only allow admins to view contact submissions
        const user = req.user;
        if (user.role !== 'admin') {
            res.status(403).json({ message: 'Access denied. Admin privileges required.' });
            return;
        }
        const { page = 1, limit = 10, search } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } }
            ];
        }
        const contacts = await Contact_1.default.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = await Contact_1.default.countDocuments(query);
        res.json({
            contacts,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    }
    catch (error) {
        console.error('Get contact submissions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getContactSubmissions = getContactSubmissions;
