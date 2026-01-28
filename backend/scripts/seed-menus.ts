import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Menu Schema (inline for migration script)
const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    icon: { type: String, trim: true },
    type: { type: String, enum: ['category', 'subcategory', 'brand'], default: 'category' },
  },
  { timestamps: true }
);

const Menu = mongoose.model('Menu', MenuSchema);

const initialMenus = [
  // All Categories - Top Level
  {
    name: 'All Categories',
    slug: 'all-categories',
    parentId: null,
    order: 0,
    type: 'category',
    isActive: true,
    children: [
      { name: 'All Products', slug: 'products', order: 0, type: 'subcategory' },
      { name: 'Microsoft', slug: 'microsoft', order: 1, type: 'subcategory' },
      { name: 'Autodesk', slug: 'autodesk', order: 2, type: 'subcategory' },
      { name: 'Adobe', slug: 'adobe', order: 3, type: 'subcategory' },
      { name: 'Antivirus', slug: 'antivirus', order: 4, type: 'subcategory' },
    ],
  },
  
  // Autodesk
  {
    name: 'Autodesk',
    slug: 'autodesk',
    parentId: null,
    order: 1,
    type: 'category',
    isActive: true,
    children: [
      { name: 'AutoCAD', slug: 'autocad', order: 0, type: 'brand' },
      { name: 'Revit', slug: 'revit', order: 1, type: 'brand' },
      { name: '3ds Max', slug: '3ds-max', order: 2, type: 'brand' },
      { name: 'Maya', slug: 'maya', order: 3, type: 'brand' },
      { name: 'Civil 3D', slug: 'civil-3d', order: 4, type: 'brand' },
      { name: 'Inventor', slug: 'inventor-professional', order: 5, type: 'brand' },
      { name: 'Fusion 360', slug: 'fusion', order: 6, type: 'brand' },
      { name: 'View All', slug: 'autodesk', order: 7, type: 'subcategory' },
    ],
  },

  // Microsoft
  {
    name: 'Microsoft',
    slug: 'microsoft',
    parentId: null,
    order: 2,
    type: 'category',
    isActive: true,
    children: [
      { name: 'Office 365', slug: 'microsoft-365', order: 0, type: 'brand' },
      { name: 'Office Professional', slug: 'microsoft-professional', order: 1, type: 'brand' },
      { name: 'Windows', slug: 'windows', order: 2, type: 'brand' },
      { name: 'Projects', slug: 'microsoft-projects', order: 3, type: 'brand' },
      { name: 'Server', slug: 'server', order: 4, type: 'brand' },
      { name: 'View All', slug: 'microsoft', order: 5, type: 'subcategory' },
    ],
  },

  // Adobe
  {
    name: 'Adobe',
    slug: 'adobe',
    parentId: null,
    order: 3,
    type: 'category',
    isActive: true,
    children: [
      { name: 'Creative Cloud', slug: 'adobe-creative-cloud', order: 0, type: 'brand' },
      { name: 'Photoshop', slug: 'photoshop', order: 1, type: 'brand' },
      { name: 'Illustrator', slug: 'illustrator', order: 2, type: 'brand' },
      { name: 'Premiere Pro', slug: 'premier-pro', order: 3, type: 'brand' },
      { name: 'After Effects', slug: 'after-effect', order: 4, type: 'brand' },
      { name: 'Lightroom', slug: 'lightroom', order: 5, type: 'brand' },
      { name: 'Acrobat Pro', slug: 'adobe-acrobat', order: 6, type: 'brand' },
      { name: 'View All', slug: 'adobe', order: 7, type: 'subcategory' },
    ],
  },

  // Antivirus & Security
  {
    name: 'Antivirus & Security',
    slug: 'antivirus',
    parentId: null,
    order: 4,
    type: 'category',
    isActive: true,
    children: [
      { name: 'Norton', slug: 'norton', order: 0, type: 'brand' },
      { name: 'McAfee', slug: 'mcafee', order: 1, type: 'brand' },
      { name: 'Kaspersky', slug: 'kaspersky', order: 2, type: 'brand' },
      { name: 'Quick Heal', slug: 'quick-heal', order: 3, type: 'brand' },
      { name: 'View All', slug: 'antivirus', order: 4, type: 'subcategory' },
    ],
  },

  // Special Offers
  {
    name: 'Special Offers',
    slug: 'special-offers',
    parentId: null,
    order: 5,
    type: 'category',
    isActive: true,
    children: [
      { name: 'Super CRM', slug: 'scrm', order: 0, type: 'subcategory' },
      { name: 'Adobe Cloud', slug: 'adobe-cloud', order: 1, type: 'subcategory' },
    ],
  },
];

async function seedMenus() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civil-ecommerce';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if menus already exist
    const existingMenus = await Menu.countDocuments();
    if (existingMenus > 0) {
      console.log(`⚠️  Found ${existingMenus} existing menus. Clearing...`);
      await Menu.deleteMany({});
      console.log('✅ Cleared existing menus');
    }

    console.log('🌱 Seeding menus...');

    // Create menus hierarchically
    for (const categoryData of initialMenus) {
      const { children, ...categoryInfo } = categoryData;

      // Create parent category
      const parentMenu = await Menu.create(categoryInfo);
      console.log(`✅ Created category: ${parentMenu.name}`);

      // Create children if exist
      if (children && children.length > 0) {
        for (const childData of children) {
          const childMenu = await Menu.create({
            ...childData,
            parentId: parentMenu._id,
          });
          console.log(`  ✅ Created subcategory: ${childMenu.name}`);
        }
      }
    }

    console.log('✅ Menu seeding completed successfully!');
    
    // Display summary
    const totalMenus = await Menu.countDocuments();
    const categories = await Menu.countDocuments({ parentId: null });
    const subcategories = await Menu.countDocuments({ parentId: { $ne: null } });
    
    console.log('\n📊 Summary:');
    console.log(`   Total Menus: ${totalMenus}`);
    console.log(`   Categories: ${categories}`);
    console.log(`   Subcategories: ${subcategories}`);

  } catch (error) {
    console.error('❌ Error seeding menus:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the seeding
seedMenus();
