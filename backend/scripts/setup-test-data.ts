import mongoose from 'mongoose';
import User from '../models/User';
import Product from '../models/Product';
import bcrypt from 'bcryptjs';

const setupTestData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Ecommerce');
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      {
        email: 'admin@test.com',
        password: adminPassword,
        fullName: 'Test Admin',
        role: 'admin',
        phoneNumber: '+919876543210'
      },
      { upsert: true, new: true }
    );
    console.log('✅ Admin user created/updated: admin@test.com / admin123');

    // Create test product with driveLink
    const product = await Product.findOneAndUpdate(
      { name: 'Test AutoCAD Product' },
      {
        name: 'Test AutoCAD Product',
        version: '1.0',
        description: 'This is a test product to verify the download feature works correctly.',
        shortDescription: 'Test product for download feature',
        category: 'autocad',
        company: 'autodesk',
        brand: 'autodesk',
        price1: 99,
        priceLifetime: 199,
        priceLifetimeINR: 199,
        hasLifetime: true,
        lifetimePrice: 199,
        lifetimePriceINR: 199,
        image: 'https://civildigitalstore.com/wp-content/uploads/2024/04/Autocad-2025-Full-Version-buy.jpg',
        imageUrl: 'https://civildigitalstore.com/wp-content/uploads/2024/04/Autocad-2025-Full-Version-buy.jpg',
        driveLink: 'https://drive.google.com/file/d/1ABC123XYZ/view',
        status: 'active',
        subscriptionDurations: [{ duration: '1 Year', price: 99 }]
      },
      { upsert: true, new: true }
    );
    console.log('✅ Test product created with driveLink:', product.driveLink);
    console.log('   Product ID:', product._id);

    console.log('\n🎉 Setup complete!');
    console.log('📧 Login: admin@test.com');
    console.log('🔑 Password: admin123');
    console.log('🛍️ Test product created with download link');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

setupTestData();
