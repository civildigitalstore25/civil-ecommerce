import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from './app';
import './config/passport';
import emailService from "./services/emailService";

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
