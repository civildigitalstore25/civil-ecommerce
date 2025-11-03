"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Public route for submitting contact form
router.post('/submit', contactController_1.submitContactForm);
// Protected route for admin to view submissions
router.get('/submissions', auth_1.authenticate, contactController_1.getContactSubmissions);
exports.default = router;
