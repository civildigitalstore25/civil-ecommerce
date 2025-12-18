import mongoose from 'mongoose';
import User from '../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Migration Script: Add Default Permissions to Existing Admins
 * 
 * This script grants all available permissions to existing admin users
 * who don't have any permissions set yet.
 * 
 * Run this after deploying the permissions feature to ensure
 * existing admins retain their current level of access.
 */

const DEFAULT_PERMISSIONS = [
  'dashboard',
  'users',
  'products',
  'categories',
  'companies',
  'orders',
  'reviews',
  'banners',
  'coupons',
];

async function migrateAdminPermissions() {
  try {
    // Connect to database
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all admins without permissions or with empty permissions array
    const adminsNeedingPermissions = await User.find({
      role: 'admin',
      $or: [
        { permissions: { $exists: false } },
        { permissions: { $size: 0 } },
      ],
    });

    console.log(`Found ${adminsNeedingPermissions.length} admins needing permissions`);

    if (adminsNeedingPermissions.length === 0) {
      console.log('No admins need migration. All admins already have permissions set.');
      await mongoose.disconnect();
      return;
    }

    // Update each admin with default permissions
    let updated = 0;
    for (const admin of adminsNeedingPermissions) {
      admin.permissions = DEFAULT_PERMISSIONS;
      await admin.save();
      updated++;
      console.log(`✓ Updated permissions for: ${admin.email}`);
    }

    console.log(`\n✅ Migration complete! Updated ${updated} admin(s) with default permissions.`);
    console.log('Default permissions granted:', DEFAULT_PERMISSIONS.join(', '));

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateAdminPermissions();
