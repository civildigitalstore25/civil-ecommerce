import dotenv from "dotenv";
dotenv.config();  // Load env before anything else
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import cartRoutes from "./routes/cartRoutes";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import emailService from "./services/emailService";
import contactRoutes from "./routes/contactRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import couponRoutes from './routes/couponRoutes';
import paymentRoutes from './routes/paymentRoutes'; // NEW
import { validatePhonePeConfig } from './config/phonepe'; // NEW
import "./config/passport";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173" || "https://civil-ecommerce-yiav.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

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
app.use('/api/payments', paymentRoutes); // NEW
app.use("/api/reviews", reviewRoutes);
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

// Test PhonePe configuration on startup
const testPhonePeConfig = () => {
  console.log('\n🔧 Testing PhonePe configuration...');
  
  const isValid = validatePhonePeConfig();
  if (isValid) {
    console.log('✅ PhonePe payment gateway is configured');
  } else {
    console.warn('⚠️  PhonePe configuration incomplete - payment functionality will not work');
    console.warn('⚠️  Please set PHONEPE_MERCHANT_ID, PHONEPE_SALT_KEY in .env file');
  }
};

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(async () => {
    console.log("✅ MongoDB connected");
    
    // Test email service after database connection
    await testEmailService();
    
    // Test PhonePe configuration
    testPhonePeConfig();
    
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