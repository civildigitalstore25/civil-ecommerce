"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load env before anything else
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/passport"); // Import passport configuration
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const emailService_1 = __importDefault(require("./services/emailService"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL);
        }
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// Add session middleware for Passport
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
app.use("/api/banners", bannerRoutes_1.default);
app.use('/api/coupons', couponRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.get("/", (req, res) => res.json({ message: "Server is running!" }));
const PORT = process.env.PORT || 5000;
// Test email service on startup
const testEmailService = async () => {
    console.log('\n🔧 Testing email configuration...');
    const requiredEmailVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
    const missingVars = requiredEmailVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.warn('⚠️  Missing email environment variables:', missingVars.join(', '));
        console.warn('⚠️  Password reset functionality will not work properly');
        return;
    }
    try {
        const isConnected = await emailService_1.default.testConnection();
        if (isConnected) {
            console.log('✅ Email service is ready for password reset functionality');
        }
        else {
            console.warn('⚠️  Email service connection failed - check your credentials');
        }
    }
    catch (error) {
        console.warn('⚠️  Email service test failed:', error);
    }
};
const testRazorpayService = () => {
    console.log('\n💳 Testing Razorpay configuration...');
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        console.warn('⚠️  Missing Razorpay credentials in environment variables');
        console.warn('⚠️  Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file');
        return false;
    }
    console.log('✅ Razorpay credentials found');
    console.log(`   Key ID: ${keyId.substring(0, 12)}...`);
    return true;
};
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("✅ MongoDB connected");
        // Test email service after database connection
        await testEmailService();
        testRazorpayService();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
            console.log('\n📧 Password reset endpoints available:');
            console.log(`   POST /api/auth/forgot-password`);
            console.log(`   GET  /api/auth/validate-reset-token/:token`);
            console.log(`   POST /api/auth/reset-password/:token`);
            console.log('\n💳 PhonePe payment endpoints available:');
            console.log(`   POST /api/payments/create-order`);
            console.log(`   POST /api/payments/callback`);
            console.log(`   GET  /api/payments/status/:merchantTransactionId`);
            console.log(`   GET  /api/payments/orders`);
            console.log(`   GET  /api/payments/orders/:orderId`);
            console.log(`   POST /api/payments/refund/:orderId`);
            console.log('\n' + '='.repeat(50));
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });
