import dotenv from "dotenv";
dotenv.config();  // Load env before anything else
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport"; // Import passport configuration
import cartRoutes from "./routes/cartRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import emailService from "./services/emailService";
import contactRoutes from "./routes/contactRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import couponRoutes from './routes/couponRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from "./routes/reviewRoutes";
import downloadRoutes from './routes/downloadRoutes';
import superadminRoutes from './routes/superadminRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import billingAddressRoutes from './routes/billingAddressRoutes';
import menuRoutes from './routes/menuRoutes';
import leadRoutes from './routes/leadRoutes';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://civil-ecommerce-yiav.vercel.app",
  "https://softzcart.vercel.app",
  "https://softzcart.com",
  "http://softzcart.com",
  "https://www.softzcart.com",
  "http://www.softzcart.com"
].filter(Boolean); // Remove undefined values

// Apply CORS middleware first
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked request from origin: ${origin}`);
        callback(null, true); // Allow anyway for now, or use: callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// Handle preflight requests - this is already handled by the cors middleware
// app.options(/.*/, cors()); // Removed - causing route parsing error
app.set('trust proxy', true);

app.use(express.json());

// Serve email footer icons
app.use("/email-images", express.static(path.join(__dirname, "email-images")));

// Add session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/banners", bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api/download', downloadRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/billing-addresses', billingAddressRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/leads', leadRoutes);

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
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log('✅ Email service is ready for password reset functionality');
    } else {
      console.warn('⚠️  Email service connection failed - check your credentials');
    }
  } catch (error) {
    console.warn('⚠️  Email service test failed:', error);
  }
};

const testCashfreeService = () => {
  console.log('\n💳 Testing Cashfree configuration...');

  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const environment = process.env.CASHFREE_ENV || 'sandbox';

  if (!appId || !secretKey) {
    console.warn('⚠️  Missing Cashfree credentials in environment variables');
    console.warn('⚠️  Add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to .env file');
    return false;
  }

  console.log('✅ Cashfree credentials found');
  console.log(`   Environment: ${environment}`);
  console.log(`   App ID: ${appId.substring(0, 12)}...`);
  return true;
};

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Test email service after database connection
    await testEmailService();

    testCashfreeService();

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
