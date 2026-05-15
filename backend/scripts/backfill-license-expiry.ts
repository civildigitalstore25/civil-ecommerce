import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import {
  calculateExpiryDate,
  inferLicenseType,
  LicenseType,
} from '../utils/licenseExpiryUtils';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/civil-ecommerce';

/**
 * Backfill script to populate licenseType and licenseExpiryDate
 * for existing orders that don't have these fields yet.
 *
 * Run with: npx ts-node scripts/backfill-license-expiry.ts
 */
async function backfillLicenseExpiry() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all orders with paid status that don't have licenseExpiryDate yet
    const orders = await Order.find({
      paymentStatus: { $in: ['paid', 'refunded'] },
    });

    console.log(`\n📦 Processing ${orders.length} orders...`);

    let updatedCount = 0;
    let skippedCount = 0;
    let lifetimeCount = 0;
    let errorCount = 0;

    for (const order of orders) {
      try {
        let needsUpdate = false;

        for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
          const item = order.items[itemIndex];

          // Skip if already has license info
          if (item.licenseType && item.licenseExpiryDate) {
            continue;
          }

          // Infer license type from pricingPlan
          let licenseType: LicenseType | null = item.licenseType
            ? (item.licenseType as LicenseType)
            : inferLicenseType(item.pricingPlan);

          // If still can't infer, try to get from product
          if (!licenseType) {
            try {
              const product = await Product.findOne({ id: item.productId });
              if (product) {
                // Check if product has pricing for different license types
                if (product.price3 || product.price3INR) {
                  licenseType = '3year';
                } else if (product.price1 || product.price1INR) {
                  licenseType = '1year';
                } else if (product.hasLifetime || product.lifetimePriceINR) {
                  licenseType = 'lifetime';
                }
              }
            } catch (e) {
              // Continue if product lookup fails
              console.warn(
                `⚠️  Could not find product for order ${order.orderId}, item ${item.productId}`
              );
            }
          }

          // If we couldn't infer, default to 1year
          if (!licenseType) {
            licenseType = '1year';
          }

          // Calculate expiry date
          const expiryDate = calculateExpiryDate(order.createdAt, licenseType);

          if (licenseType === 'lifetime') {
            lifetimeCount++;
          }

          // Update item
          order.items[itemIndex].licenseType = licenseType;
          order.items[itemIndex].licenseExpiryDate = expiryDate;

          needsUpdate = true;
        }

        // Save if updated
        if (needsUpdate) {
          await order.save();
          updatedCount++;

          if (updatedCount % 50 === 0) {
            console.log(`  ⏳ Updated ${updatedCount} orders...`);
          }
        } else {
          skippedCount++;
        }
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Error processing order ${order.orderId}:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.log(`\n✅ Backfill complete!`);
    console.log(`   📊 Updated: ${updatedCount} orders`);
    console.log(`   ⏭️  Skipped: ${skippedCount} orders (already had license info)`);
    console.log(`   ♾️  Lifetime: ${lifetimeCount} items`);
    if (errorCount > 0) {
      console.log(`   ❌ Errors: ${errorCount} orders`);
    }

    // Verify results
    const verifyOrders = await Order.find({
      'items.licenseExpiryDate': { $exists: true, $ne: null },
    });
    console.log(`\n🔍 Verification: ${verifyOrders.length} orders have license expiry info`);

    process.exit(0);
  } catch (error) {
    console.error(
      '❌ Fatal error:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

// Run the backfill
backfillLicenseExpiry();
