import express from 'express';
import path from 'path';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

import cartRoutes from './routes/cartRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import contactRoutes from './routes/contactRoutes';
import bannerRoutes from './routes/bannerRoutes';
import couponRoutes from './routes/couponRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import downloadRoutes from './routes/downloadRoutes';
import superadminRoutes from './routes/superadminRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import billingAddressRoutes from './routes/billingAddressRoutes';
import menuRoutes from './routes/menuRoutes';
import leadRoutes from './routes/leadRoutes';
import dealsRoutes from './routes/dealsRoutes';
import freeProductsRoutes from './routes/freeProductsRoutes';
import blogRoutes from './routes/blogRoutes';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://civil-ecommerce-yiav.vercel.app',
  'https://softzcart.vercel.app',
  'https://softzcart.com',
  'http://softzcart.com',
  'https://www.softzcart.com',
  'http://www.softzcart.com'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS blocked request from origin: ${origin}`);
        callback(null, true);
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

app.set('trust proxy', true);
app.use(express.json({ limit: '10mb' }));

app.use(
  '/email-images',
  express.static(path.resolve(process.cwd(), 'email-images'))
);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/billing-addresses', billingAddressRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/free-products', freeProductsRoutes);
app.use('/api', blogRoutes);

app.get('/', (_req, res) => res.json({ message: 'Server is running!' }));

export default app;
